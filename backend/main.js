const express = require('express')
const app = express()
const port = 3001
const solanaWeb3 = require("@solana/web3.js");
const { PublicKey } = solanaWeb3;
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const axios = require('axios')
const { Metaplex } = require('@metaplex-foundation/js');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const cors = require('cors');
const version = 'mainnet-beta'


app.use(express.json());
app.use(cors({
    origin: '*'
}));


const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(version),
    'confirmed'
);


const metaplex = Metaplex.make(connection);

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

async function cacheMiddleware(key, fetchFunction) {
    const cachedData = cache.get(key);
    if (cachedData) {
        return cachedData;
    }

    const data = await fetchFunction();
    cache.set(key, data);
    return data;
}

async function updateTokenIdsCache() {
    try {
        const data = await cacheMiddleware('tokenIds', async () => {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
            return response.data;
        });
        cachedTokenIds = data;
        tokenIdsLastUpdated = Date.now();
        console.log('Список tokenIds оновлено');
    } catch (error) {
        console.error('Помилка оновлення tokenIds:', error.message);
    }
}

updateTokenIdsCache();

setInterval(updateTokenIdsCache, 24 * 60 * 60 * 1000);

app.get('/checkAccount', (req, res) => {
    const address = req.query.address;

    if (!address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
        return res.status(400).json({ error: 'Неправильна адресса' });
    }

    if (address.length > 50) {
        return res.status(400).json({ error: 'Адреса дуже довга' });
    }

    (async () => {
        try {
            const publicKey = new solanaWeb3.PublicKey(address);

            const accountInfo = await connection.getAccountInfo(publicKey);
            const balance = await connection.getBalance(publicKey);

            const tokenAccounts = await getTokenAccounts(publicKey);
            const tokenSymbolsArr = tokenAccounts.map(token => token.symbol.toLowerCase());
            const tokenPrices = {};

            const tokensToFetch = [];
            for (const symbol of tokenSymbolsArr) {
                const cached = cache.get(`tokenPrice_${symbol}`);
                if (cached) {
                    tokenPrices[symbol] = cached;
                } else {
                    tokensToFetch.push(symbol);
                }
            }

            if (tokensToFetch.length > 0) {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                    params: {
                        ids: tokensToFetch.join(','),
                        vs_currencies: 'usd',
                    },
                    timeout: 10000,
                });
                for (const symbol of tokensToFetch) {
                    const priceData = response.data[symbol] || {};
                    cache.set(`tokenPrice_${symbol}`, priceData, 3600);
                    tokenPrices[symbol] = priceData;
                }
            }

            const totalTokensValueUSD = tokenAccounts.reduce((sum, token) => {
                const tokenPrice = tokenPrices[token.symbol.toLowerCase()]?.usd || 0;
                return sum + (token.amount * tokenPrice);
            }, 0);

            const response = {
                address,
                exists: accountInfo !== null,
                balance: balance / solanaWeb3.LAMPORTS_PER_SOL,
                executable: accountInfo ? accountInfo.executable : null,
                ownerProgram: accountInfo ? accountInfo.owner.toString() : null,
                rentEpoch: accountInfo ? accountInfo.rentEpoch : null,
                dataSize: accountInfo ? accountInfo.data.length : null,
                totalTokensValueUSD: Number(totalTokensValueUSD.toFixed(2)),
            };

            res.json(response);
        } catch (error) {
            console.error('Помилка при отриманні данних для аккаунта:', error);
            res.status(500).json({ error: 'Помилка при отриманні данних для аккаунта' });
        }
    })();
})

async function getTokenAccounts(ownerPublicKey) {
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
            programId: TOKEN_PROGRAM_ID,
        });

        const validAccounts = tokenAccounts.value.filter(
            (accountInfo) => accountInfo.account.data.parsed.info.tokenAmount.uiAmount > 0
        );

        const mintAddresses = validAccounts.map(
            (accountInfo) => new PublicKey(accountInfo.account.data.parsed.info.mint)
        );

        const metadatas = await metaplex.nfts().findAllByMintList({ mints: mintAddresses });

        const tokens = validAccounts.map(async (accountInfo, index) => {
            const { pubkey, account } = accountInfo;
            const parsed = account.data.parsed;
            const mintAddress = parsed.info.mint;
            const balance = parsed.info.tokenAmount.uiAmount;
            const decimals = parsed.info.tokenAmount.decimals;

            const metadata = metadatas[index];
            let image = null;

            try {
                const metadataResponse = await fetch(metadata.uri);
                const metadataJson = await metadataResponse.json();
                image = metadataJson.image || null;
            } catch (error) {
                console.error(`Помилка завантаження metadata для ${mintAddress}:`, error.message);
            }

            const name = metadata?.name || 'Невідомий токен';
            const symbol = metadata?.symbol || '???';

            return {
                mint: mintAddress,
                name,
                symbol,
                amount: balance,
                decimals,
                image,
                tokenAccount: pubkey.toBase58(),
            };
        });

        return Promise.all(tokens).then((resolvedTokens) => resolvedTokens.sort((a, b) => b.amount - a.amount));

    } catch (error) {
        console.error('Помилка отримання токенів:', error);
        return [];
    }
}

app.get('/history', async (req, res) => {
    const address = req.query.address;

    if (!address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
        return res.status(400).json({ error: 'Неправильна адресса' });
    }

    if (address.length > 50) {
        return res.status(400).json({ error: 'Адреса дуже довга' });
    }

    try {
        const publicKey = new PublicKey(address);

        const history = await cacheMiddleware(`history_${address}`, async () => {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const startTimestamp = startOfMonth.getTime() / 1000;

            const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 1000 });
            const recentSignatures = signatures.filter(sig => {
                return sig.blockTime && sig.blockTime >= startTimestamp;
            });

            const balanceChanges = {};

            for (const sig of recentSignatures) {
                const blockTime = new Date(sig.blockTime * 1000);
                const dateKey = blockTime.toISOString().split('T')[0];

                if (!balanceChanges[dateKey]) {
                    const balance = await connection.getBalance(publicKey, sig.slot);
                    balanceChanges[dateKey] = balance / 1e9;
                }
            }

            const currentBalance = await connection.getBalance(publicKey);
            const currentBalanceSOL = currentBalance / 1e9;

            const history = [];
            let lastKnownBalance = null;

            const dateIterator = new Date(startOfMonth);
            while (dateIterator <= now) {
                const dateKey = dateIterator.toISOString().split('T')[0];

                if (balanceChanges[dateKey] !== undefined) {
                    lastKnownBalance = balanceChanges[dateKey];
                }

                if (lastKnownBalance === null) {
                    lastKnownBalance = currentBalanceSOL;
                }

                history.push({
                    date: dateKey,
                    balanceSOL: lastKnownBalance,
                });

                dateIterator.setDate(dateIterator.getDate() + 1);
            }

            const solPrices = await getSolPricesLast30Days();

            return history.map(entry => {
                const price = solPrices[entry.date] || null;
                const roundedPrice = price !== null ? Number(price.toFixed(2)) : null;
                return {
                    date: entry.date,
                    balanceSOL: Number(entry.balanceSOL.toFixed(4)),
                    solPriceUSDT: roundedPrice,
                    totalUSDT: roundedPrice !== null ? Number((entry.balanceSOL * roundedPrice).toFixed(2)) : null,
                };
            });
        });

        res.json(history);
    } catch (err) {
        console.error('Ошибка при получении истории:', err);
        res.status(500).send('Internal Server Error');
    }
});

async function getSolPricesLast30Days() {
    return await cacheMiddleware('solPricesLast30Days', async () => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/solana/market_chart', {
                params: {
                    vs_currency: 'usd',
                    days: 30,
                },
            });

            const pricesArray = response.data.prices;

            const prices = {};

            for (const [timestamp, price] of pricesArray) {
                const date = new Date(timestamp).toISOString().split('T')[0];
                prices[date] = price;
            }

            return prices;
        } catch (error) {
            console.error('Помилка отримання ціни на 30 днів:', error.message);
            return {};
        }
    });
}

app.get('/tokens', async (req, res) => {
    const address = req.query.address;

    if (!address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
        return res.status(400).json({ error: 'Неправильна адресса' });
    }

    if (address.length > 50) {
        return res.status(400).json({ error: 'Адреса дуже довга' });
    }

    try {
        const publicKey = new PublicKey(address);

        const tokens = await cacheMiddleware(`tokens_${address}`, async () => {
            const tokenAccounts = await getTokenAccounts(publicKey);
            const tokenSymbolsArr = tokenAccounts.map(token => token.symbol.toLowerCase());

            const tokenPrices = {};
            const tokensToFetch = [];
            for (const symbol of tokenSymbolsArr) {
                const cached = cache.get(`tokenPrice_${symbol}`);
                if (cached) {
                    tokenPrices[symbol] = cached;
                } else {
                    tokensToFetch.push(symbol);
                }
            }

            if (tokensToFetch.length > 0) {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                    params: {
                        ids: tokensToFetch.join(','),
                        vs_currencies: 'usd',
                        include_24hr_change: true,
                    },
                    timeout: 10000,
                });
                for (const symbol of tokensToFetch) {
                    const priceData = response.data[symbol] || {};
                    cache.set(`tokenPrice_${symbol}`, priceData, 3600); // 1 час
                    tokenPrices[symbol] = priceData;
                }
            }

            return tokenAccounts.map(token => {
                const priceData = tokenPrices[token.symbol.toLowerCase()] || {};
                const price = priceData.usd ?? null;
                const priceChange1h = priceData.usd_24h_change ?? null;
                const image = token.image || null;

                return {
                    ...token,
                    priceUSD: price,
                    priceChange1h: priceChange1h !== null ? Number(priceChange1h.toFixed(2)) : null,
                    totalValueUSD: price !== null ? Number((token.amount * price).toFixed(2)) : null,
                    image: image || null,
                };
            }).filter(token => token.priceUSD !== null);
        });

        res.json(tokens);
    } catch (error) {
        console.error('Помилка при отриманні токенів:', error);
        res.status(500).json({ error: 'Помилка при отриманні токенів' });
    }
});

let cachedTokenIds = [];

app.get('/tokengraph', async (req, res) => {
    const symbol = req.query.symbol;
    if (!symbol) {
        return res.status(400).json({ error: 'Потрібно вказати symbol токена' });
    }

    if (symbol.length > 50) {
        return res.status(400).json({ error: 'Назва дуже велика' });
    }

    try {
        const tokenId = cachedTokenIds.find(token => token.symbol === symbol.toLowerCase())?.id;
        if (!tokenId) {
            return res.status(404).json({ error: 'Токен не знайден' });
        }

        const pricesArray = await cacheMiddleware(`prices_${tokenId}`, async () => {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: 30,
                },
            });
            return response.data.prices;
        });

        res.json(pricesArray);
    } catch (error) {
        console.error('Помилка при отриманні данних токена:', error.message);
        return res.status(500).json({ error: 'Помилка при отриманні данних токена' });
    }
});

app.listen(port, (err) => {
    if (err) {
        console.log(`${err}`);
    } else {
        console.log(`${port}`);
    }
});