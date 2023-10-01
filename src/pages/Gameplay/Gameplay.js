import React, { useEffect, useRef, useState } from "react";
import classes from "./Gameplay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faStar,
  faFeather,
  faShield,
  faSmile,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import LostScreen from "./LostScreen";
import { useDispatch, useSelector } from "react-redux";
import { gameplayActions } from "../../state/gameplaySlice";
import getContrastColor from "../../helpers/contrastColour";
import { collection, getDoc, doc, } from "firebase/firestore";
import { db } from "../../firebase/config";
import { updateHighScoreAsync } from "../../state/gameplaySlice";
import imageOne from "../../../src/images/imageOne.jpg";
import Paused from "../../components/Paused/Paused";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const animations = [
  { scale: 0.9 },
  { rotate: 90 },
  // { opacity: 0.5 },
  { rotate: -90 },
  { skew: 20 },
  { skew: -20 },
  { scale: 1.2 },
  { rotateZ: 180 },
  { borderRadius: "50%" },
];

const Gameplay = () => {
  const timerRef = useRef(); //use so dont get new timer ID on re render
  const {
    currentValue,
    targetValue,
    score,
    lost,
    highScore,
    startingSpeed,
    difficulty,
  } = useSelector((state) => state.gameplay);
  const speed = parseFloat((1 + score * 0.05).toFixed(2))

  const { currentColours, currentBackgroundData } = useSelector(
    (state) => state.marketplace
  );
  const userCollectionRef = collection(db, "users");
  const currentUserId = useSelector((state) => state.ui.userData?.uid);
  const loggedIn = useSelector((state) => state.ui.loggedIn);
  const [paused, setPaused] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const { darkMode } = useSelector((state) => state.ui);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const modeIcon =
    difficulty === "Easy"
      ? faFeather
      : difficulty === "Medium"
      ? faShield
      : difficulty === "Hard"
      ? faSkullCrossbones
      : faSmile;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const multiplier =
    difficulty === "Easy"
      ? 1
      : difficulty === "Medium"
      ? 1.5
      : difficulty === "Hard"
      ? 2
      : 1;
  const finalScore = Math.floor(multiplier * score);

  // useEffect hook that runs when 'lost' changes
  const loseGame = () => {
    console.log("LOSING");
    dispatch(gameplayActions.setLoss());
    dispatch(updateHighScoreAsync(finalScore));
    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    const img = new Image();
    img.src = currentBackgroundData ? currentBackgroundData.url : imageOne;
    img.onload = () => setImageLoaded(true);
  }, [currentBackgroundData]);

  // Timer
  useEffect(() => {
    if (paused || lost || !imageLoaded) return;  // Added imageLoaded condition here
    dispatch(gameplayActions.handleStartGame(true));

    timerRef.current = setTimeout(() => {
      //if (lost) return; if want to optimise performance
      dispatch(gameplayActions.incrementCurrentValue());


      setColorIndex((curr) => (curr + 1) % currentColours.length);
    }, Math.max(startingSpeed / speed, 200));

    return () => clearTimeout(timerRef.current);
  }, [currentValue, currentColours, paused,imageLoaded, lost]);

  //checks if current value gone too far
  useEffect(() => {
    if (currentValue > targetValue) {
      console.log("currentValue > targetValue", finalScore);
      dispatch(updateHighScoreAsync(finalScore));
      dispatch(gameplayActions.setLoss());
    }
  }, [currentValue, targetValue]);

  //If logged in will get high score from firestore and dispatch to redux
  useEffect(() => {
    const getHighScoreForUser = async () => {
      if (currentUserId) {
        const userDocRef = doc(userCollectionRef, currentUserId);
        const userDoc = await getDoc(userDocRef);
        const firestoreHighscore = userDoc.data().highScore;

        dispatch(
          gameplayActions.setInitialAccountHighScore(firestoreHighscore)
        );
      }
    };

    getHighScoreForUser();
  }, [currentUserId]);

  //game lost when unmounts DOESNT UPDATE HIGHSCORE WELL

  //Handle component unmounts
  useEffect(() => {
    return () => {
      console.log("Component unmounting");
      dispatch(gameplayActions.setLoss());
      dispatch(updateHighScoreAsync(finalScore));
      // dispatch(gameplayActions.handleRestart());
    };
  }, []);

  const handleRestart = () => {
    setPaused(false);
    dispatch(gameplayActions.handleRestart());
  };

  const handleHome = () => {
    dispatch(gameplayActions.handleRestart());
    navigate("/");
  };

  if (lost) {
    return (
      <LostScreen
        highScore={highScore}
        score={score}
        speed={speed}
        mode={difficulty}
        multiplier={multiplier}
        onRestart={() => dispatch(gameplayActions.handleRestart())}
      />
    );
  }

  return (
    <div
      className={`${classes.background} ${
        darkMode ? classes["dark-theme"] : classes["light-theme"]
      }`}
    >
      <AnimatePresence>
        {imageLoaded && <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          style={{
            backgroundImage: `url(${
              currentBackgroundData ? currentBackgroundData.url : imageOne
            })`,
            color: currentBackgroundData
              ? currentBackgroundData.opposingColour
              : "white",
          }}
          className={classes.container}
        >
          {paused && (
            <Paused
              onHome={handleHome}
              onRestart={handleRestart}
              onResume={() => setPaused(false)}
            />
          )}
          <div className={classes.top}>
            {loggedIn && (
              <span className={classes.highscore}>Highscore: {highScore}</span>
            )}
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              icon={faPause}
              className={classes.pauseIcon}
              size="xl"
              onClick={() => setPaused((prev) => !prev)}
            />
          </div>
          <div className={classes.middle}>
            <div className={classes.target}>{targetValue}</div>
            <div
              onMouseDown={() => {
                if (currentValue === targetValue) {
                  dispatch(gameplayActions.handleCurrentValueClick());
                  setCurrentAnimation(
                    (currentAnimation + 1) % animations.length
                  );
                } else if (currentValue < targetValue) {
                  loseGame();
                  // console.log("LOSING");
                  // dispatch(gameplayActions.setLoss());
                  // dispatch(updateHighScoreAsync(finalScore));
                }
              }}
            >
              <motion.div
                whileTap={
                  animations[Math.floor(Math.random() * animations.length)]
                }
                style={{
                  backgroundColor: `#${currentColours[colorIndex]}`,
                  color: getContrastColor(currentColours[colorIndex]),
                }}
                className={classes.current}
              >
                {currentValue}
              </motion.div>
            </div>
          </div>
          <div className={classes.bottom}>
            <div className={classes.score}>
              <FontAwesomeIcon className={classes.starIcon} icon={faStar} />
              <span className={classes.points}>{`${score} points`}</span>
            </div>
            <div className={classes.speed}>
              <FontAwesomeIcon className={classes.modeIcon} icon={modeIcon} />
              <span>
                {startingSpeed === 700
                  ? " Easy "
                  : startingSpeed === 550
                  ? " Medium "
                  : startingSpeed === 400
                  ? " Hard "
                  : undefined}
              </span>
            </div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default Gameplay;
