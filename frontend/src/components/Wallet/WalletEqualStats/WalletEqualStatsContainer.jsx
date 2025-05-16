import React from "react";
import { connect } from "react-redux";
import { useEffect } from "react";

import WalletEqualStats from "./WalletEqualStats";

import {
  getTokens,
  tokensListIsFetching,
} from "../../../redux/selectors/walletSelectors";
import { setTokensInfo } from "../../../redux/walletReducer";

let WalletEqualStatsContainer = React.memo((props) => {
  const getTokensInfo = props.setTokensInfo;
  useEffect(() => {
    getTokensInfo();
  }, [getTokensInfo]);
  if (props.tokensListIsFetching === false) {
    return <WalletEqualStats {...props} />;
  }
});

const mapStateToProps = (state) => {
  return {
    tokens: getTokens(state),
    tokensListIsFetching: tokensListIsFetching(state),
  };
};

export default connect(mapStateToProps, { setTokensInfo })(
  WalletEqualStatsContainer
);
