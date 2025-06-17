import { walletAPI } from "../api/walletAPI";

const SET_TOKENS_INFO = "promisesync/wallet/SET_TOKENS_INFO";
const SET_TOKENS_FETCHING = "promisesync/wallet/SET_TOKENS_FETCHING";
const SET_TOKENS_GRAPH_DATA = "promisesync/wallet/SET_TOKENS_GRAPH_DATA";
const SET_GRAPH_DATA_IS_FETCHING = "promisesync/wallet/SET_GRAPH_DATA_IS_FET";
const SET_CURRENT_TOKEN_SYMBOL = "promisesync/wallet/SET_CURRENT_TOKEN_SYMBOL";

let initialState = {
  walletTokens: [],
  tokensGraphData: [],
  currentSymbol: null,
  tokensIsFetching: true,
  graphDataIsFetching: true,
};

export const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKENS_INFO:
      return {
        ...state,
        walletTokens: [...action.tokensInfo],
      };
    case SET_TOKENS_FETCHING:
      return {
        ...state,
        tokensIsFetching: action.fetchingStatus,
      };
    case SET_TOKENS_GRAPH_DATA:
      return {
        ...state,
        tokensGraphData: action.tokensData,
      };
    case SET_GRAPH_DATA_IS_FETCHING:
      return {
        ...state,
        graphDataIsFetching: action.fetchingStatus,
      };
    case SET_CURRENT_TOKEN_SYMBOL:
      return {
        ...state,
        currentSymbol: action.currentSymbol,
      };
    default:
      return state;
  }
};

export const setTokensAC = (tokensInfo) => {
  return { type: SET_TOKENS_INFO, tokensInfo };
};
export const setWalletFetchingAC = (fetchingStatus) => {
  return { type: SET_TOKENS_FETCHING, fetchingStatus };
};
export const setGraphDataIsFetchingAC = (fetchingStatus) => {
  return { type: SET_GRAPH_DATA_IS_FETCHING, fetchingStatus };
};
export const setTokensGraphDataAC = (tokensData) => {
  return {
    type: SET_TOKENS_GRAPH_DATA,
    tokensData,
  };
};
export const setCurrentTokenSymbolAC = (currentSymbol) => {
  return {
    type: SET_CURRENT_TOKEN_SYMBOL,
    currentSymbol,
  };
};
export const setWalletInfo = () => {
  return (dispatch) => {
    dispatch(setWalletFetchingAC(true));
    return walletAPI.getTokens().then((response) => {
      dispatch(setTokensAC(response));
      dispatch(setCurrentTokenSymbolAC(response[0]["symbol"]));
      dispatch(getTokensGraphData(response[0]["symbol"]));
      dispatch(setWalletFetchingAC(false));
    });
  };
};
export const getTokensGraphData = (tokenSymbol) => {
  return (dispatch) => {
    dispatch(setGraphDataIsFetchingAC(true));
    return walletAPI.getTokensGraphData(tokenSymbol).then((response) => {
      dispatch(setTokensGraphDataAC(response));
      dispatch(setCurrentTokenSymbolAC(tokenSymbol));
      dispatch(setGraphDataIsFetchingAC(false));
    });
  };
};
