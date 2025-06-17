import { setWalletInfo } from "./walletReducer";

const SET_INITIALIZED_STATUS = "promisesync/app/SET_INITIALIZE_STATUS";

let initialState = {
  initializedApp: false,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INITIALIZED_STATUS:
      return {
        ...state,
        initializedApp: action.initializngStatus,
      };
    default:
      return state;
  }
};

export const initializngStatusAC = (initializngStatus) => {
  return { type: SET_INITIALIZED_STATUS, initializngStatus };
};

export const initializeApp = () => {
  return (dispatch) => {
    dispatch(initializngStatusAC(false));
    Promise.all([dispatch(setWalletInfo())]).then(() => {
      dispatch(initializngStatusAC(true));
    });
  };
};
