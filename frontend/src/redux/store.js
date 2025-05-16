import {
  configureStore,
  combineReducers,
  // applyMiddleware,
} from "@reduxjs/toolkit";

import { walletReducer } from "./walletReducer";

const reducer = combineReducers({
  walletPage: walletReducer,
});

const store = configureStore({
  reducer: reducer,
});

export { store };
