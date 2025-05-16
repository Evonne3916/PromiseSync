import s from "./Header.module.css";
import logo from "../../assets/images/header_logo.png";
import avatar from "../../assets/images/user_first_avatar.jpg";
import notification from "../../assets/images/header_notification.svg";
import twitter from "../../assets/images/header_twitter.svg";
import github from "../../assets/images/header_github.svg";

const Header = (props) => {
  return (
    <header className={s.header}>
      <div className={s.header__inner}>
        <div className={s.header__left}>
          <img src={logo} alt="" className={s.header_logo__img} />
          <div className={s.header_logo__title}>SakuFi</div>
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
};

export default Header;
