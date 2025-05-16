import s from "./Wallet.module.css";

import { WalletItem } from "./WalletItem/WalletItem";

import { CreateWalletLineTokenGraph } from "../../common/CustomGraphs/CreateWalletLineTokenGraph";
import { CreateDoughnutTokenGraph } from "../../common/CustomGraphs/CreateDoughnutTokenGraph";
import { CreateHorizontalBarTokenChart } from "../../common/CustomGraphs/CreateHorizontalBarTokenChart";
// import { NavLink } from "react-router-dom";

const Wallet = (props) => {
  return (
    <div className={s.wallet}>
      <div className={s.container}>
        <div className={s.wallet_inner}>
          <div className={s.wallet_left}>
            {props.tokens.map((t) => {
              return (
                <WalletItem
                  getTokensGraphData={props.getTokensGraphData}
                  token={t}
                />
              );
            })}
          </div>
          <div className={s.wallet_right}>
            <CreateWalletLineTokenGraph
              graphData={props.graphData}
              graphDataIsFetching={props.graphDataIsFetching}
              currentSymbol={props.currentSymbol}
            />

            <div className={s.wallet_right__sub_graphs}>
              <div className={s.wallet_right__doughnut_graph}>
                <CreateDoughnutTokenGraph tokens={props.tokens} />
                <div className={s.wallet_right_doughnut_graph__title}>
                  Total tokens cost | USD
                </div>
              </div>
              <div className={s.wallet_right__horizontalbar_graph}>
                <div className={s.wallet_right_horizontalbar_graph__title}>
                  Total tokens amount
                </div>
                <CreateHorizontalBarTokenChart tokens={props.tokens} />
              </div>
            </div>
            {/* <div className={s.wallet_right__footer}>
              <NavLink
                className={s.wallet_right_show_more__btn}
                to="/equalStats"
              >
                See general statistics
              </NavLink>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
