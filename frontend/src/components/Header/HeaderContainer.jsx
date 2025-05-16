import React from "react";
import { connect } from "react-redux";

import Header from "./Header";

let HeaderContainer = (props) => {
  return <Header {...props} />;
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {})(HeaderContainer);
