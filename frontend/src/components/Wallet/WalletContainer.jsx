import React from "react";
import { connect } from "react-redux";

import Wallet from "./Wallet";

import {
  currentSymbol,
  getTokens,
  graphData,
  graphDataIsFetching,
} from "../../redux/selectors/walletSelectors";

import { getTokensGraphData } from "../../redux/walletReducer";

let WalletContainer = React.memo((props) => {
  return <Wallet {...props} />;
});

const mapStateToProps = (state) => {
  return {
    tokens: getTokens(state),
    graphDataIsFetching: graphDataIsFetching(state),
    graphData: graphData(state),
    currentSymbol: currentSymbol(state),
  };
};

export default connect(mapStateToProps, { getTokensGraphData })(
  WalletContainer
);
