import s from "./WalletItem.module.css";
import graph from "../../../assets/images/graph.svg";

const WalletItem = (props) => {
  const tokenSymbolValue = props.token.symbol;
  let totalValueUSD =
    props.token.totalValueUSD === "~0" ? 0 : props.token.totalValueUSD;

  const onGraphButtonClick = () => {
    props.getTokensGraphData(tokenSymbolValue);
  };

  return (
    <div className={s.walletItem}>
      <div className={s.walletItem_left}>
        <div className={s.walletItem_token_img}>
          {props.token.image !== null ? (
            <img src={props.token.image} alt="" />
          ) : (
            <svg
              fill="#000000"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier"></g>
              <g id="SVGRepo_tracerCarrier"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm8.706 19.517H10.34a.59.59 0 00-.415.17l-2.838 2.815a.291.291 0 00.207.498H21.66a.59.59 0 00.415-.17l2.838-2.816a.291.291 0 00-.207-.497zm-3.046-5.292H7.294l-.068.007a.291.291 0 00-.14.49l2.84 2.816.07.06c.1.07.22.11.344.11h14.366l.068-.007a.291.291 0 00.14-.49l-2.84-2.816-.07-.06a.59.59 0 00-.344-.11zM24.706 9H10.34a.59.59 0 00-.415.17l-2.838 2.816a.291.291 0 00.207.497H21.66a.59.59 0 00.415-.17l2.838-2.815A.291.291 0 0024.706 9z"></path>
              </g>
            </svg>
          )}
        </div>
      </div>
      <div className={s.walletItem_right}>
        <div className={s.walletItem_info}>
          <div className={s.walletItem_name}>{props.token.name}</div>
          <div className={s.walletItem_symbol}>{props.token.symbol}</div>
          <div
            className={`${s.walletItem_priceChange} ${
              props.token.priceChange1h >= 0 ? s.raise : s.falls
            }`}
          >
            {props.token.priceChange1h != null ? props.token.priceChange1h : 0}$
          </div>
        </div>
        <div className={s.walletItem_price}>
          <div className={s.walletItem_amount}>{props.token.amount}</div>
          <div className={s.walletItem_value}>{totalValueUSD.toFixed(2)}$</div>
          <div className={s.walletItem_buttons}>
            <button className={s.walletItem_btn} onClick={onGraphButtonClick}>
              <img src={graph} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { WalletItem };
