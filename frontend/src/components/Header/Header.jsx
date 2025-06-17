import s from "./Header.module.css";
import logo from "../../assets/images/header_logo.png";
import avatar from "../../assets/images/user_first_avatar.jpg";
import notification from "../../assets/images/header_notification.svg";
import twitter from "../../assets/images/header_twitter.svg";
import github from "../../assets/images/header_github.svg";

const Header = (props) => {
  if (props.tokensListIsFetching === false) {
    let address = "9az5xpAV8KJ2Q2Jb1ZvBpvfUa5Cj4dZirbgvfPF5XsB8";
    const getWalletAddressFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const address = urlParams.get("address");
      return address ? encodeURIComponent(address) : null;
    };
    const pageAddress = getWalletAddressFromUrl();
    if (
      pageAddress !== null &&
      pageAddress !== undefined &&
      pageAddress !== ""
    ) {
      address = pageAddress;
    }
    let totalValue = 0;
    for (let i = 0; i < props.tokens.length; i++) {
      totalValue +=
        props.tokens[i]["totalValueUSD"] === "~0"
          ? 0
          : props.tokens[i]["totalValueUSD"];
    }

    return (
      <header className={s.header}>
        <div className={s.header__inner}>
          <div className={s.header__left}>
            <img src={logo} alt="" className={s.header_logo__img} />
            <div className={s.header_logo__title}>Solance</div>
            <div className={s.header__balance}>
              Total Balance: {totalValue.toFixed(2)}
            </div>
          </div>
          <div className={s.header__center}>
            <a href="https://github.com/Evonne3916/PromiseSync">
              <img src={github} alt="" className={s.header__social} />
            </a>
            <a href="https://x.com/appSolance">
              <img src={twitter} alt="" className={s.header__social} />
            </a>
          </div>
          <div className={s.header__right}>
            <div className={s.header_right__current_address}>
              Your current address: {address}
            </div>
            <div className={s.header__notifications}>
              <button className={s.header_notifications__btn}>
                <img src={notification} alt="" />
              </button>
            </div>
            <img src={avatar} alt="" className={s.user__avatar} />
          </div>
        </div>
      </header>
    );
  }
};

export default Header;
