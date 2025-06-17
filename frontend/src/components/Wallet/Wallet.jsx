import s from "./Wallet.module.css";

import { WalletItem } from "./WalletItem/WalletItem";
import { WalletRight } from "./WalletRight/WalletRight";

import { Preloader } from "../../common/Preloader/Preloader";

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
          {props.graphDataIsFetching ? (
            <div className={s.preloader__wrapper}>
              <Preloader preloaderText="Uploading your tickets" />
            </div>
          ) : (
            <WalletRight {...props} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
