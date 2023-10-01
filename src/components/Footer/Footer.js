import React from "react";
import classes from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { uiStateActions } from "../../state/uiStateSlice";
import { MarketPlaceActions } from "../../state/MarketPlaceSlice";
import { gameplayActions } from "../../state/gameplaySlice";
import { auth } from "../../firebase/config";
import { Link } from "react-router-dom";

const Footer = () => {
  const { darkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(uiStateActions.toggleLoggedIn(false));
      dispatch(MarketPlaceActions.clearState());
      dispatch(gameplayActions.setInitialAccountHighScore(0));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`${classes.footer} ${
        darkMode ? classes["dark-theme"] : classes["light-theme"]
      }`}
    >
      <div className={classes.container}>
        <div className={classes.left}>
          <span className={classes.link} onClick={logout}>
            Logout
          </span>
          <Link to={'/'}>
            <span>How to play</span>
          </Link>
          <span>contact us</span>
        </div>
        <div className={classes.right}>
          <span>Follow us on socials!</span>
          <div className={classes.icons}>
            <FontAwesomeIcon icon={faFacebook} size="xl" />
            <FontAwesomeIcon icon={faInstagram} size="xl" />
            <FontAwesomeIcon icon={faTwitch} size="xl" />
            <FontAwesomeIcon icon={faTwitter} size="xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
