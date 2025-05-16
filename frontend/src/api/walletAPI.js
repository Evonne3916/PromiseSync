import axios from "axios";

const baseUrl = "https://api.solance-app.com";
const address = "9az5xpAV8KJ2Q2Jb1ZvBpvfUa5Cj4dZirbgvfPF5XsB8";

const walletAPI = {
  getTokens() {
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
