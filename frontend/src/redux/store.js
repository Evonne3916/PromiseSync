import {
  configureStore,
  combineReducers,
  // applyMiddleware,
} from "@reduxjs/toolkit";

import { walletReducer } from "./walletReducer";
import { appReducer } from "./appReducer";

const reducer = combineReducers({
  accountPage: appReducer,
  walletPage: walletReducer,
});

const store = configureStore({
  reducer: reducer,
});

export { store };
