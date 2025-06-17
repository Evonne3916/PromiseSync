import s from "../Wallet.module.css";

import { CreateWalletLineTokenGraph } from "../../../common/CustomGraphs/CreateWalletLineTokenGraph";
import { CreateDoughnutTokenGraph } from "../../../common/CustomGraphs/CreateDoughnutTokenGraph";

export const WalletRight = (props) => {
  return (
    <div className={s.wallet_right}>
      <CreateWalletLineTokenGraph
        graphData={props.graphData}
        graphDataIsFetching={props.graphDataIsFetching}
        currentSymbol={props.currentSymbol}
      />

      <div className={s.wallet_right__sub_graphs}>
        <div className={s.wallet_right__doughnut_graph}>
          <CreateDoughnutTokenGraph
            tokens={props.tokens}
            graphDataIsFetching={props.graphDataIsFetching}
          />
          <div className={s.wallet_right_doughnut_graph__title}>
            Total tokens cost | USD
          </div>
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
  );
};
