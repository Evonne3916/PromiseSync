import s from "./Preloader.module.css";
import preloader from "../../assets/images/preload.gif";

const Preloader = (props) => {
  return (
    <div className={s.preloader}>
      <img src={preloader} alt="" />
      <div className={s.preloader__text}>{props.preloaderText}</div>
    </div>
  );
};

export { Preloader };
