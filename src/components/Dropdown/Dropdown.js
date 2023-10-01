import React, { useEffect, useState, useRef } from "react";
import classes from "./Dropdown.module.css";
import { useDispatch, useSelector } from "react-redux";
import { gameplayActions } from "../../state/gameplaySlice";
import { useLocation } from "react-router-dom";
// import { CSSTransition } from "react-transition-group";
import { motion } from "framer-motion";

const Dropdown = () => {
  const [showList, setShowList] = useState(false);
  const dispatch = useDispatch();
  const { difficulty } = useSelector((state) => state.gameplay);
  const { inGame } = useSelector((state) => state.gameplay);
  const { darkMode } = useSelector((state) => state.ui);
  console.log(inGame, "ingame");
  const variants = {
    hidden: { scale: 0.5 },
    visible: { scale: 1 },
    exit: { scale: 0.5 }
  };
  

  let location = useLocation();

  useEffect(() => {
    setShowList(false);
  }, [location]);

  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null); // New ref for the header

  // click listener when dropdown is open
  useEffect(() => {
    if (showList) {
      const handleClickOutside = (event) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setShowList(false);
        }
      };

      // add listener

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      // cleanup function
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }
  }, [showList]); // dependency on showList

  return (
    !inGame && (
      <div
        className={`${classes.wrapper} ${
          darkMode ? classes["dark-theme"] : classes["light-theme"]
        }`}
      >
        <div
          ref={dropdownRef}
          onTouchEnd={(e) => {
            e.preventDefault();
            setShowList((prev) => !prev);
          }}
          onClick={() => setShowList((prev) => !prev)}
          className={classes.header}
        >
          <span>Difficulty</span>
        </div>
          {showList && (
            <motion.div
              ref={wrapperRef}
              className={classes["list-of-options-wrapper"]}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.1, ease: "easeOut" }}
              >
              <div className={classes.container}>
                <button
                  disabled={inGame}
                  className={difficulty === "Easy" ? classes.chosen : ""}
                  onClick={() =>
                    dispatch(
                      gameplayActions.changeDifficulty({
                        startingSpeed: 700,
                        difficulty: "Easy",
                      })
                    )
                  }
                >
                  Easy
                </button>
                <button
                  disabled={inGame}
                  className={difficulty === "Medium" ? classes.chosen : ""}
                  onClick={() =>
                    dispatch(
                      gameplayActions.changeDifficulty({
                        startingSpeed: 550,
                        difficulty: "Medium",
                      })
                    )
                  }
                >
                  Medium
                </button>
                <button
                  disabled={inGame}
                  className={difficulty === "Hard" ? classes.chosen : ""}
                  onClick={() =>
                    dispatch(
                      gameplayActions.changeDifficulty({
                        startingSpeed: 400,
                        difficulty: "Hard",
                      })
                    )
                  }
                >
                  Hard
                </button>
              </div>
            </motion.div>
          )}
      </div>
    )
  );
};

export default Dropdown;
