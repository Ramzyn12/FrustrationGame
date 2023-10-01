import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { Link, redirect, useNavigate, useSearchParams } from "react-router-dom";
import { uiStateActions } from "../../state/uiStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { gameplayActions } from "../../state/gameplaySlice";
import { MarketPlaceActions } from "../../state/MarketPlaceSlice";
import localforage from "localforage";
import imageOne from "../../images/imageOne.jpg";
import useFormField from "./useFormField";
import FormInput from "./FormInput";
import loginImage from '../../../src/images/Login.png'

const initialData = {
  highScore: 0,
  selectedColours: ["70d6ff", "ff70a6", "ff9770", "ffd670", "e9ff70"],
  selectedBackground: { url: imageOne, opposingColour: 'rgb(57, 57, 57)' },
};

const Login = () => {
  const [param, setParam] = useSearchParams();
  const formType = param.get("type");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailFormField = useFormField("");
  const passwordFormField = useFormField("");
  const emailInvalid =
    emailFormField.touched &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailFormField.value);
  const passwordInvalid =
    passwordFormField.touched && passwordFormField.value.trim().length < 6;
  const formIsValid =
    !emailInvalid &&
    !passwordInvalid &&
    emailFormField.value.trim() !== "" &&
    passwordFormField.value.trim() !== "";

  const emailClass =
    emailInvalid || emailFormField.errorMessage ? classes.invalid : "";
  const passwordClass =
    passwordInvalid || passwordFormField.errorMessage ? classes.invalid : "";
  const { darkMode } = useSelector((state) => state.ui);

  const updateUserAndLocalStorage = async (userId, userData) => {
    // Dispatch data to store
    dispatch(gameplayActions.setInitialAccountHighScore(userData.highScore));
    dispatch(MarketPlaceActions.pickScheme(userData.selectedColours));
    dispatch(MarketPlaceActions.pickBackground(userData.selectedBackground));

    // Store data in Local Storage
    localforage.setItem(userId + "_colours", userData.selectedColours);
    localforage.setItem(userId + "_background", userData.selectedBackground);
    localforage.setItem(userId + "_highScore", userData.highScore);
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    emailFormField.setErrorMessage("");
    passwordFormField.setErrorMessage("");
    passwordFormField.setTouched(true);
    emailFormField.setTouched(true);

    if (formType === "signup" && formIsValid) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          emailFormField.value,
          passwordFormField.value
        );
        const userId = userCredentials.user.uid;

        const userDocRef = doc(db, "users", userId); // Create a reference to the document with the user's ID
        await setDoc(userDocRef, initialData); // Set the document data

        await updateUserAndLocalStorage(userId, initialData);

        dispatch(uiStateActions.toggleLoggedIn(true));
        navigate("/");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          emailFormField.setErrorMessage("Email already in use");
        } else if (error.code === "auth/weak-password") {
          passwordFormField.setErrorMessage(
            "Password must be at least 6 characaters"
          );
        } else if (error.code === "auth/invalid-email") {
          emailFormField.setErrorMessage("Please choose a valid Email");
        }
      }
    }
    if (formType === "login" && formIsValid) {
      try {
        const signInInfo = await signInWithEmailAndPassword(
          auth,
          emailFormField.value,
          passwordFormField.value
        );
        const userId = signInInfo.user.uid;

        //fetch data from fireStore
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          updateUserAndLocalStorage(userId, userData);
        }

        dispatch(uiStateActions.toggleLoggedIn(true));
        emailFormField.setValue("");
        passwordFormField.setValue("");
        emailFormField.setTouched(false);
        passwordFormField.setTouched(false);
        navigate("/");
      } catch (error) {
        //show error ui
        console.error(error);
        if (error.code === "auth/wrong-password") {
          passwordFormField.setErrorMessage("Incorrect Password");
        }
        if (error.code === "auth/user-not-found") {
          emailFormField.setErrorMessage("User Not Found");
        }
        if (error.code === "auth/invalid-email") {
          emailFormField.setErrorMessage("Invalid Email");
        }
        if (error.code === "auth/too-many-requests") {
          passwordFormField.setErrorMessage(
            "No attempts left, try again later"
          );
        }
      }
    }
  };

  //reset form info when form type changes
  useEffect(() => {
    emailFormField.setValue("");
    passwordFormField.setValue("");
    emailFormField.setErrorMessage("");
    passwordFormField.setErrorMessage("");
    emailFormField.setTouched(false);
    passwordFormField.setTouched(false);
  }, [formType]);

  return (
    <div
      className={`${classes.container} ${
        darkMode ? classes["dark-theme"] : classes["light-theme"]
      }`}
    >
      <div className={classes.left}>
        <div className={classes["left-container"]}>
          <h1 className={classes.title}>
            {formType === "signup" ? "Sign Up Here!" : "Welcome Back!"}
          </h1>
          <h3 className={classes.subtitle}>(Sign up with any random email with @ and ending in ".com" to test)</h3>
          <form onSubmit={handleFormSubmission} className={classes.form}>
            <FormInput
              id="email"
              type="text"
              className={emailClass}
              value={emailFormField.value}
              onBlur={emailFormField.handleBlur}
              onChange={emailFormField.handleChange}
              invalid={emailInvalid}
              errorClassName={classes["invalid-message"]}
              containerClassName={classes.controls}
              errorMessage={emailFormField.errorMessage}
            />
            <FormInput
              id="password"
              type="password"
              className={passwordClass}
              value={passwordFormField.value}
              onBlur={passwordFormField.handleBlur}
              onChange={passwordFormField.handleChange}
              invalid={passwordInvalid}
              errorClassName={classes["invalid-message"]}
              containerClassName={classes.controls}
              errorMessage={passwordFormField.errorMessage}
            />
            <button>{formType === "signup" ? "Sign Up!" : "Login"}</button>
          </form>
          {formType === "login" && (
            <p>
              Dont have an account?{" "}
              <Link to={"/login?type=signup"}>Sign up</Link>
            </p>
          )}
          {formType === "signup" && (
            <p>
              Already have an account?{" "}
              <Link to={"/login?type=login"}>Log-In</Link>
            </p>
          )}
        </div>
        {/* Thing here which says login to get highSCore, access marketplace etc... */}
      </div>
      <div className={classes.right}>
        <img src={loginImage} alt="login"/>
      </div>
    </div>
  );
};

export default Login;
