const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');

const proxyes = fs.readFileSync('backend/proxy.txt', 'utf8');

class ProxyManager {
    constructor() {
        this.proxies = [];
        this.currentProxyIndex = 0;
        this.requestCounts = new Map();
        this.resetTimes = new Map();
        this.REQUESTS_PER_MINUTE = 5;
        this.REQUESTS_PER_MONTH = 10000;
        this.statsFilePath = path.join(__dirname, 'proxy_stats.json');
        this.proxyStats = new Map();
        this.loadProxies();
        this.loadStats();
    }

    loadProxies() {
        const proxyLines = proxyes.split('\n').filter(line => line.trim());
        this.proxies = proxyLines.map((proxyLine, index) => {
            const proxyUrl = proxyLine.trim();
            return {
                id: index,
                url: proxyUrl,
                agent: new HttpsProxyAgent(proxyUrl),
                isActive: true,
                lastError: null,
                lastErrorTime: null
            };
        });
        
        this.proxies.forEach((proxy, index) => {
            this.requestCounts.set(index, 0);
            this.resetTimes.set(index, Date.now());
            
            if (!this.proxyStats.has(index)) {
                this.proxyStats.set(index, {
                    totalRequests: 0,
                    monthlyRequests: 0,
                    successfulRequests: 0,
                    failedRequests: 0,
                    monthStarted: new Date().getMonth(),
                    yearStarted: new Date().getFullYear(),
                    lastUsed: null,
                    errors: []
                });
            }
        });
        
        console.log(`[ProxyManager] Загружено ${this.proxies.length} прокси-серверов`);
    }

    loadStats() {
        try {
            if (fs.existsSync(this.statsFilePath)) {
                const statsData = fs.readFileSync(this.statsFilePath, 'utf8');
                const stats = JSON.parse(statsData);
                
                Object.entries(stats).forEach(([proxyId, proxyStats]) => {
                    const id = parseInt(proxyId);
                    
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    
                    if (proxyStats.monthStarted !== currentMonth || proxyStats.yearStarted !== currentYear) {
                        proxyStats.monthlyRequests = 0;
                        proxyStats.monthStarted = currentMonth;
                        proxyStats.yearStarted = currentYear;
                    }
                    
                    this.proxyStats.set(id, proxyStats);
                });
                
                console.log('[ProxyManager] Статистика прокси загружена');
            }
        } catch (error) {
            console.error('[ProxyManager] Ошибка загрузки статистики:', error.message);
        }
    }

    saveStats() {
        try {
            const statsObject = {};
            this.proxyStats.forEach((stats, proxyId) => {
                statsObject[proxyId] = stats;
            });
            
            fs.writeFileSync(this.statsFilePath, JSON.stringify(statsObject, null, 2), 'utf8');
        } catch (error) {
            console.error('[ProxyManager] Ошибка сохранения статистики:', error.message);
        }
    }

    isProxyAvailable(proxyIndex) {
        const now = Date.now();
        const proxy = this.proxies[proxyIndex];
        const stats = this.proxyStats.get(proxyIndex);
        
        if (!proxy || !proxy.isActive) {
            return false;
        }
        
        if (stats.monthlyRequests >= this.REQUESTS_PER_MONTH) {
            return false;
        }
        
        const resetTime = this.resetTimes.get(proxyIndex);
        const requestCount = this.requestCounts.get(proxyIndex);
        
        if (now - resetTime >= 60000) {
            this.requestCounts.set(proxyIndex, 0);
            this.resetTimes.set(proxyIndex, now);
            return true;
        }
        
        return requestCount < this.REQUESTS_PER_MINUTE;
    }

    getNextAvailableProxy() {
        const startIndex = this.currentProxyIndex;
        
        for (let i = 0; i < this.proxies.length; i++) {
            const proxyIndex = (startIndex + i) % this.proxies.length;
            
            if (this.isProxyAvailable(proxyIndex)) {
                this.currentProxyIndex = (proxyIndex + 1) % this.proxies.length;
                return { index: proxyIndex, proxy: this.proxies[proxyIndex] };
            }
        }
        
        return null;
    }

    markProxyUsed(proxyIndex, success = true) {
        const currentCount = this.requestCounts.get(proxyIndex) || 0;
        this.requestCounts.set(proxyIndex, currentCount + 1);
        
        const stats = this.proxyStats.get(proxyIndex);
        if (stats) {
            stats.totalRequests++;
            stats.monthlyRequests++;
            stats.lastUsed = Date.now();
            
            if (success) {
                stats.successfulRequests++;
            } else {
                stats.failedRequests++;
            }
            
            this.proxyStats.set(proxyIndex, stats);
        }
        
        if (stats.totalRequests % 10 === 0) {
            this.saveStats();
        }
    }

    markProxyError(proxyIndex, error) {
        const proxy = this.proxies[proxyIndex];
        const stats = this.proxyStats.get(proxyIndex);
        
        if (proxy && stats) {
            proxy.lastError = error.message;
            proxy.lastErrorTime = Date.now();
            
            stats.errors.push({
                message: error.message,
                timestamp: Date.now(),
                code: error.code || 'UNKNOWN'
            });
            
            if (stats.errors.length > 10) {
                stats.errors = stats.errors.slice(-10);
            }
            
            const recentErrors = stats.errors.filter(err => 
                Date.now() - err.timestamp < 5 * 60 * 1000
            );
            
            if (recentErrors.length >= 5) {
                proxy.isActive = false;
                console.warn(`[ProxyManager] Прокси #${proxyIndex + 1} временно деактивирован из-за частых ошибок`);

                setTimeout(() => {
                    proxy.isActive = true;
                    console.log(`[ProxyManager] Прокси #${proxyIndex + 1} реактивирован`);
                }, 10 * 60 * 1000);
            }
            
            this.proxyStats.set(proxyIndex, stats);
        }
    }

    getWaitTime() {
        const now = Date.now();
        let minWaitTime = Infinity;
        
        for (let i = 0; i < this.proxies.length; i++) {
            const stats = this.proxyStats.get(i);
            
            if (stats.monthlyRequests >= this.REQUESTS_PER_MONTH) {
                continue;
            }
            
            const resetTime = this.resetTimes.get(i);
            const requestCount = this.requestCounts.get(i);
            
            if (requestCount >= this.REQUESTS_PER_MINUTE) {
                const waitTime = 60000 - (now - resetTime);
                if (waitTime > 0 && waitTime < minWaitTime) {
                    minWaitTime = waitTime;
                }
            } else {
                return 0;
            }
        }
        
        return minWaitTime === Infinity ? 0 : minWaitTime;
    }

    getProxyStatistics() {
        const stats = [];
        
        for (let i = 0; i < this.proxies.length; i++) {
            const proxy = this.proxies[i];
            const proxyStats = this.proxyStats.get(i);
            const currentRequests = this.requestCounts.get(i) || 0;
            const resetTime = this.resetTimes.get(i);
            const timeSinceReset = Date.now() - resetTime;
            
            stats.push({
                id: i + 1,
                isActive: proxy.isActive,
                url: proxy.url.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@'),
                minuteRequests: `${currentRequests}/${this.REQUESTS_PER_MINUTE}`,
                minuteResetIn: Math.max(0, 60000 - timeSinceReset),
                monthlyRequests: `${proxyStats.monthlyRequests}/${this.REQUESTS_PER_MONTH}`,
                totalRequests: proxyStats.totalRequests,
                successRate: proxyStats.totalRequests > 0 ? 
                    ((proxyStats.successfulRequests / proxyStats.totalRequests) * 100).toFixed(1) + '%' : '0%',
                lastUsed: proxyStats.lastUsed ? new Date(proxyStats.lastUsed).toLocaleString() : 'Никогда',
                lastError: proxy.lastError || 'Нет',
                lastErrorTime: proxy.lastErrorTime ? new Date(proxy.lastErrorTime).toLocaleString() : 'Нет'
            });
        }
        
        return stats;
    }
}

const proxyManager = new ProxyManager();

async function makeRequestWithProxy(url, params = {}, maxRetries = 3) {
    let lastError = null;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        const proxyInfo = proxyManager.getNextAvailableProxy();
        
        if (!proxyInfo) {
            const waitTime = proxyManager.getWaitTime();
            throw new Error(`Все прокси недоступны. Время ожидания: ${Math.ceil(waitTime / 1000)} секунд`);
        }
        
        try {
            const response = await axios.get(url, {
                params: params,
                httpsAgent: proxyInfo.proxy.agent,
                timeout: 15000,
            });
            
            proxyManager.markProxyUsed(proxyInfo.index, true);
            console.log(`[ProxyManager] Запрос выполнен через прокси #${proxyInfo.index + 1} (попытка ${attempt + 1})`);
            
            return response;
            
        } catch (error) {
            attempt++;
            lastError = error;
            
            proxyManager.markProxyUsed(proxyInfo.index, false);
            proxyManager.markProxyError(proxyInfo.index, error);
            
            console.warn(`[ProxyManager] Ошибка на прокси #${proxyInfo.index + 1} (попытка ${attempt}/${maxRetries}): ${error.message}`);
            
            if (attempt < maxRetries) {
                console.log(`[ProxyManager] Пробуем следующий прокси...`);
                continue;
            }
        }
    }
    
    throw new Error(`Не удалось выполнить запрос после ${maxRetries} попыток. Последняя ошибка: ${lastError?.message}`);
}

function printProxyStatistics() {
    const stats = proxyManager.getProxyStatistics();
    console.log('\n=== СТАТИСТИКА ПРОКСИ ===');
    console.table(stats);
    console.log('========================\n');
}

setInterval(() => {
    proxyManager.saveStats();
}, 5 * 60 * 1000);

setInterval(() => {
    printProxyStatistics();
}, 30 * 60 * 1000);

function startProxyUpdate() {
    console.log('[ProxyManager] Система прокси инициализирована');
    console.log(`[ProxyManager] Лимиты: ${proxyManager.REQUESTS_PER_MINUTE} запросов/минуту, ${proxyManager.REQUESTS_PER_MONTH} запросов/месяц`);
}

module.exports = {
    ProxyManager,
    proxyManager,
    makeRequestWithProxy,
    printProxyStatistics,
    startProxyUpdate
};