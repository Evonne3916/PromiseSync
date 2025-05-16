import axios from "axios";

const baseUrl = "https://api.solance-app.com";
let address = "9az5xpAV8KJ2Q2Jb1ZvBpvfUa5Cj4dZirbgvfPF5XsB8";

const getWalletAddressFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const address = urlParams.get("address");
  return address ? encodeURIComponent(address) : null;
};

const walletAPI = {
  getTokens() {
    let address2 = getWalletAddressFromUrl();
    if (address2 !== null && address2 !== undefined && address2 !== "") {
      address = address2;
    }
    return axios({
      method: "get",
      url: baseUrl + `/tokens?address=${address}`,
      withCredentials: true,
    }).then((response) => response.data);
  },
  getTokensGraphData(tokenSymbol) {
    return axios({
      method: "get",
      url: baseUrl + `/tokengraph?symbol=${tokenSymbol}`,
      withCredentials: true,
    }).then((response) => response.data);
  },
};

export { walletAPI };
