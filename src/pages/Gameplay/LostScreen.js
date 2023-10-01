import React from "react";
import classes from "./LostScreen.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gameplayActions } from "../../state/gameplaySlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFeather,
  faShield,
  faSkull,
  faSkullCrossbones,
  faSmile,
  faStar,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { motion } from "framer-motion";



const LostScreen = (props) => {
  const loggedIn = useSelector((state) => state.ui.loggedIn);
  const { darkMode } = useSelector((state) => state.ui);
  const { difficulty } = useSelector((state) => state.gameplay);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleHome = () => {
    dispatch(gameplayActions.handleRestart());
    navigate("/");
  };
  const modeIcon =
    difficulty === "Easy"
      ? faFeather
      : difficulty === "Medium"
      ? faShield
      : difficulty === "Hard"
      ? faSkullCrossbones
      : faSmile;

  //beware of these refs
  const finalScoreRef = useRef(Math.floor(props.multiplier * props.score));
  const finalHighScoreRef = useRef(props.highScore);

  const shake = {
    x: [0, -30, 30, -30, 30, 0],
    transition: { duration: 0.2 },
  };
  return (
    <div
      className={`${classes.background} ${
        darkMode ? classes["dark-theme"] : classes["light-theme"]
      }`}
    >
      <motion.div
        className={classes.container}
        initial={{ opacity: 0 }}
        animate={{...shake, opacity: 1}}
      >
        <div className={classes.top}>
          <div className={classes.title}>Game Over</div>
        </div>
        <div className={classes.middle}>
          <div className={classes["points-section"]}>
            <FontAwesomeIcon className={classes.icon} icon={faStar} size="xl" />
            <div className={classes["points"]}>{`${props.score} pts`}</div>
          </div>
          <div className={classes["mode-section"]}>
            <FontAwesomeIcon
              className={classes.icon}
              icon={modeIcon}
              size="xl"
            />
            <div className={classes["mode"]}>{`${props.mode}`}</div>
          </div>
          <div className={classes["final-score-section"]}>
            <div className={classes["final-score-title"]}>TOTAL SCORE</div>
            <div className={classes["final-score"]}>
              {finalScoreRef.current}
            </div>
          </div>
          {loggedIn && (
            <div className={classes["high-score-section"]}>
              <div className={classes["high-score-title"]}>High Score</div>
              <div className={classes["high-score"]}>
                
                {finalHighScoreRef.current}
              </div>
            </div>
          )}
        </div>
        <div className={classes.bottom}>
          <button onClick={() => props.onRestart()}>Try Again</button>
          <button onClick={handleHome}>Home</button>
        </div>
      </motion.div>
    </div>
  );
};

export default LostScreen;
