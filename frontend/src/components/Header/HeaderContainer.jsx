import React from "react";
import { connect } from "react-redux";

import Header from "./Header";
import {
  getTokens,
  tokensListIsFetching,
} from "../../redux/selectors/walletSelectors";

let HeaderContainer = (props) => {
  return <Header {...props} />;
};

const mapStateToProps = (state) => {
  return {
    tokens: getTokens(state),
    tokensListIsFetching: tokensListIsFetching(state),
  };
};

export default connect(mapStateToProps, {})(HeaderContainer);
