import React from "react";
import classes from "./ColourScheme.module.css";
import { useDispatch, useSelector } from "react-redux";
import { MarketPlaceActions } from "../../state/MarketPlaceSlice";
import { collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import localforage from "localforage";
import { motion } from "framer-motion";

const ColourScheme = (props) => {
  const dispatch = useDispatch();

  const currentScheme = useSelector(
    (state) => state.marketplace.currentColours
  );
  const currentUserId = useSelector((state) => state.ui.userData?.uid);
  const userCollectionRef = collection(db, "users");

  const background = `linear-gradient(
    to right,
    #${props.schemeData[0]} 0%,
    #${props.schemeData[0]} 20%,
    #${props.schemeData[1]} 20%,
    #${props.schemeData[1]} 40%,
    #${props.schemeData[2]} 40%,
    #${props.schemeData[2]} 60%,
    #${props.schemeData[3]} 60%,
    #${props.schemeData[3]} 80%,
    #${props.schemeData[4]} 80%,
    #${props.schemeData[4]} 100%
  )`;

  const schemeClass =
    JSON.stringify(currentScheme) === JSON.stringify(props.schemeData)
      ? `${classes.scheme} ${classes.selected}`
      : classes.scheme;

  const handleColorSchemeClick = async () => {
    dispatch(MarketPlaceActions.pickScheme(props.schemeData));
    if (currentUserId) {
      const userDocRef = doc(userCollectionRef, currentUserId);
      await updateDoc(userDocRef, {
        selectedColours: props.schemeData,
      });
      localforage.setItem(currentUserId + "_colours", props.schemeData);
    }
  };

  const hideClass = props.highScore > props.level ? "" : classes.hide;


  return (
    <motion.button
      style={{ background: background }}
      onClick={props.highScore > props.level ? handleColorSchemeClick : null}
      className={schemeClass}
      variants={props.variants}
    >
      {(props.highScore <= props.level && props. level !== 0) && (
        <div className={hideClass}>Level: {props.level}</div>
      )}
    </motion.button>
  );
};

export default ColourScheme;
