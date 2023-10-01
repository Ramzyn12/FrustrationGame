import React, { useState } from "react";
import classes from "./Marketplace.module.css";
import ColourScheme from "../../components/ColourScheme/ColourScheme";
import { colourData } from "../../components/ColourScheme/colourData";
import Slider from "../../components/Slider/Slider";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import { useSelector } from "react-redux";
import BackgroundData from "../../components/Slider/BackgroundData";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPaintBrush } from "@fortawesome/free-solid-svg-icons";

const stagger = {
  animate: {
    transition: {
      // This will stagger the animation of children by 0.1 seconds
      staggerChildren: 0.05,
    },
  },
};

const childVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
};

const Marketplace = () => {
  const COLOURSCHEMES = colourData;
  const BACKGROUNDS = BackgroundData;
  const [showColours, setShowColours] = useState(true);
  const { highScore } = useSelector((state) => state.gameplay);
  const { darkMode, loggedIn } = useSelector((state) => state.ui);

  return (
    <div
      className={`${classes.background} ${
        darkMode ? classes["dark-theme"] : classes["light-theme"]
      }`}
    >
      <div className={classes.container}>
        <div className={classes.top}>
          <h1 className={classes.title}>Marketplace</h1>
          <div className={classes.banner}>
            <div className={classes.line}></div>
            <h3>Customise your game</h3>
            <div className={classes.line}></div>
          </div>
        </div>
        <div className={classes.selection}>
          <div
            onClick={() => setShowColours(true)}
            className={`${classes.colours} ${
              showColours === true && classes.selected
            }`}
          >
            <FontAwesomeIcon icon={faPaintBrush} />
            Colours
          </div>
          <div
            onClick={() => setShowColours(false)}
            className={`${classes.backgrounds} ${
              showColours === false && classes.selected
            }`}
          >
            {" "}
            <FontAwesomeIcon icon={faImage} />
            Backgrounds
          </div>
        </div>
        {/* Colours or Backgrounds */}
        {!showColours && (
          <div className={classes.yes}>
            {loggedIn && (
              <div className={classes.subtitle}>Pick your background!</div>
            )}
            {!loggedIn && (
              <div className={classes["login-prompt"]}>
                <Link to={"/login?type=login"} className={classes.login}>
                  Login
                </Link>{" "}
                to unlock new backgrounds!
              </div>
            )}
            <Slider highScore={highScore} backgroundData={BACKGROUNDS} />
          </div>
        )}
        {showColours && (
          <motion.div
            className={classes.coloursWrapper}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {loggedIn && (
              <div className={classes.subtitle}>Pick your colour scheme!</div>
            )}
            {!loggedIn && (
              <div className={classes["login-prompt"]}>
                <Link to={"/login?type=login"} className={classes.login}>
                  Login
                </Link>{" "}
                to unlock new colours!
              </div>
            )}
            <div className={classes["grid-container"]}>
              {COLOURSCHEMES.map((scheme, index) => (
                <ColourScheme
                  key={index}
                  highScore={highScore}
                  level={scheme.level}
                  mode={scheme.mode}
                  schemeData={scheme.scheme}
                  variants={childVariants}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
