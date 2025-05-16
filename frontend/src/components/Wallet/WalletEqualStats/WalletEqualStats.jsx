import s from "./WalletEqualStats.module.css";
import main from "../../../assets/images/back-to-main.svg";

import { NavLink } from "react-router-dom";

import { CreateDoughnutTokenGraph } from "../../../common/CustomGraphs/CreateDoughnutTokenGraph";

const WalletEqualStats = (props) => {
  return (
    <div className={s.wallet_equal_stats}>
      <div className={s.wallet_equal_stats__inner}>
        <NavLink
          className={s.wallet_equal_stats__main}
          to="https://my.solance-app.com"
        >
          <img className={s.wallet_equal_stats_main__img} src={main} alt="" />
        </NavLink>
        <div className={s.wallet_equal_stats__wrapper}>
          <div className={s.wallet_equal_stats__title}>
            Total tokens cost in USD
          </div>
          <div className={s.wallet_equal_stats__graph}>
            <CreateDoughnutTokenGraph tokens={props.tokens} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletEqualStats;
