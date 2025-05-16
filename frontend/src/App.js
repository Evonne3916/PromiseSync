import s from "./App.module.css";

import HeaderContainer from "./components/Header/HeaderContainer";
import WalletContainer from "./components/Wallet/WalletContainer";
import WalletEqualStatsContainer from "./components/Wallet/WalletEqualStats/WalletEqualStatsContainer";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className={s.app}>
      <HeaderContainer />
      <Routes>
        <Route path="" element={<WalletContainer />} />
      </Routes>
    </div>
  );
}

export default App;
