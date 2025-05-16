export const getTokens = (state) => {
  return state.walletPage.walletTokens;
};

export const tokensListIsFetching = (state) => {
  return state.walletPage.tokensIsFetching;
};

export const graphData = (state) => {
  return state.walletPage.tokensGraphData;
};
export const graphDataIsFetching = (state) => {
  return state.walletPage.graphDataIsFetching;
};
export const currentSymbol = (state) => {
  return state.walletPage.currentSymbol;
};
