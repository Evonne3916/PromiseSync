import React from "react";
import { connect } from "react-redux";
import { useEffect } from "react";

import Wallet from "./Wallet";

import {
  currentSymbol,
  getTokens,
  graphData,
  graphDataIsFetching,
  tokensListIsFetching,
} from "../../redux/selectors/walletSelectors";

import { setTokensInfo, getTokensGraphData } from "../../redux/walletReducer";

let WalletContainer = React.memo((props) => {
  // const [tokensList, setTokens] = useState(props.tokens);
  const getTokensInfo = props.setTokensInfo;
  useEffect(() => {
    getTokensInfo();
  }, [getTokensInfo]);
  if (props.tokensListIsFetching === false) {
    return <Wallet {...props} />;
  }
});

const mapStateToProps = (state) => {
  return {
    tokens: getTokens(state),
    tokensListIsFetching: tokensListIsFetching(state),
    graphDataIsFetching: graphDataIsFetching(state),
    graphData: graphData(state),
    currentSymbol: currentSymbol(state),
  };
};

export default connect(mapStateToProps, { setTokensInfo, getTokensGraphData })(
  WalletContainer
);
