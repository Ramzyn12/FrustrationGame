import React, { useState } from "react";
import classes from "./Home.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gameplayActions } from "../../state/gameplaySlice";
import frustrated from "../../../src/images/frustrated.png";

const Home = () => {
  const { darkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [showRules, setShowRules] = useState(false);

  return (
    <div
      className={`${classes.background} ${
        darkMode ? classes["dark-theme"] : classes["light-theme"]
      }`}
    >
      <div className={classes.container}>
        <h1 className={classes.titleName}>Can you handle it?</h1>
        <h1 className={classes.title}>The game of nerve and timing</h1>
        <p className={classes.writing}>
          Welcome to a world where timing is everything and patience is tested.
          Do you have what it takes to tap your way to victory? Or will you join
          the ranks of the frustrated?
        </p>
        <div
          className={classes.controls}
          style={{ alignItems: showRules ? "baseline" : "stretch" }}
        >
          <Link
            to={"/play"}
            onClick={() => dispatch(gameplayActions.handleRestart())}
            className={classes["play-link"]}
          >
            Play Now
          </Link>
          {!showRules && (
            <button
              onClick={() => setShowRules(true)}
              className={classes["how-to-play-button"]}
            >
              How to play
            </button>
          )}
          {showRules && (
            <button
              onClick={() => setShowRules(false)}
              className={classes.rules}
            >
              Click the square as soon as the two middle numbers are equal. Play on
              higher difficulties to multiply your final score!
            </button>
          )}
        </div>
      </div>
      <img src={frustrated} className={classes.frusImage} />
    </div>
  );
};

export default Home;
