import s from "./App.module.css";

import HeaderContainer from "./components/Header/HeaderContainer";
import WalletContainer from "./components/Wallet/WalletContainer";

import { connect } from "react-redux";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { initializeApp } from "./redux/appReducer";
import { getInitializingStatus } from "./redux/selectors/accountPageSelectors";

import { Preloader } from "./common/Preloader/Preloader";

function App(props) {
  const initializeApp = props.initializeApp;
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);
  if (props.initializingStatus === true) {
    return (
      <div className={s.app}>
        <HeaderContainer />
        <Routes>
          <Route path="" element={<WalletContainer />} />
        </Routes>
      </div>
    );
  } else {
    return <Preloader preloaderText="Loading" />;
  }
}

const mapStateToProps = (state) => {
  return {
    initializingStatus: getInitializingStatus(state),
  };
};

export default connect(mapStateToProps, { initializeApp })(App);
