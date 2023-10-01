import React from "react";
import classes from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { uiStateActions } from "../../state/uiStateSlice";
import { MarketPlaceActions } from "../../state/MarketPlaceSlice";
import { useState } from "react";
import { gameplayActions } from "../../state/gameplaySlice";
import localforage from "localforage";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const Header = () => {
  const loggedIn = useSelector((state) => state.ui.loggedIn);
  const userData = useSelector((state) => state.ui.userData);
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const { darkMode } = useSelector((state) => state.ui);
  const [isNavOpen, setIsNavOpen] = useState(false);

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

  useEffect(() => {
    localforage.getItem("Mode").then((storedMode) => {
      // If storedMode is not null, convert it to boolean and dispatch action
      if (storedMode !== null) {
        dispatch(uiStateActions.toggleDarkMode(storedMode === "true"));
      }
      // If it's null, it means there's no saved theme, so use a default
      else {
        dispatch(uiStateActions.toggleDarkMode(true)); // default is light mode
      }
    });
  }, [dispatch]);

  // ...

  const handleToggleDarkMode = () => {
    const newMode = !darkMode; // Get the opposite of the current mode
    dispatch(uiStateActions.toggleDarkMode(newMode)); // Set the new mode in Redux
    localforage.setItem("Mode", newMode.toString()); // Store the new mode in local storage
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // const slideIn = {
  //   hidden: { x: "-100%", opacity: 0 },
  //   visible: { x: "0%", opacity: 1 },
  //   exit: { x: "100%", opacity: 0 },
  // };

  return (
    <header
      className={`${classes.header} ${
        darkMode ? classes["dark-theme"] : classes["light-theme"]
      }`}
    >
      <div className={classes.container}>
        <Link to={"/"} className={classes.ignore}>
          <h1 className={classes.title}>Frustration</h1>
        </Link>
        <button className={classes.burger} onClick={toggleNav}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div
          className={`${classes.navigation} ${
            isNavOpen ? classes["nav-active"] : ""
          }`}
        >
          {isNavOpen && (
            <button
              className={classes.exit}
              onClick={() => setIsNavOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <span>
            {darkMode && (
              <FontAwesomeIcon
                className={classes.icon}
                onClick={() => {
                  handleToggleDarkMode();
                  setIsNavOpen(false);
                }}
                icon={faMoon}
              />
            )}
            {!darkMode && (
              <FontAwesomeIcon
                className={classes.icon}
                onClick={() => {
                  handleToggleDarkMode();
                  setIsNavOpen(false);
                }}
                icon={faSun}
              />
            )}
          </span>
          <span>
            <NavLink
              to={"/marketplace"}
              className={({ isActive }) => (isActive ? classes.active : "")}
              onClick={() => setIsNavOpen(false)}
            >
              Marketplace
            </NavLink>
          </span>
          <Dropdown />
          <span>
            <NavLink
              to={"/play"}
              onClick={() => {
                dispatch(gameplayActions.handleRestart());
                setIsNavOpen(false);
              }}
              className={({ isActive }) => (isActive ? classes.active : "")}
            >
              Play
            </NavLink>
          </span>
          <span>
            {/* want to change this depending if im logged in on firebase */}
            {!loggedIn ? (
              <NavLink
                className={({ isActive }) => (isActive ? classes.active : "")}
                to={"/login?type=login"}
                onClick={() => setIsNavOpen(false)}
              >
                Login
              </NavLink>
            ) : (
              <span
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={logout}
                className={classes.user}
              >
                {loggedIn && isHovered ? "Logout" : userData && userData.email}
              </span>
            )}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
