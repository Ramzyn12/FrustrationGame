import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import classes from "./Slider.module.css";
import React from "react";
import BackgroundData from "./BackgroundData";
import { useDispatch, useSelector } from "react-redux";
import { MarketPlaceActions } from "../../state/MarketPlaceSlice";
import { doc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import localforage from "localforage";
import { motion } from "framer-motion";

const Slider = (props) => {
  const dispatch = useDispatch();
  const chosenBackground = useSelector(
    (state) => state.marketplace.currentBackgroundData
  );
  const userCollectionRef = collection(db, "users");
  const currentUserId = useSelector((state) => state.ui.userData?.uid);

  const handleBackgroundClick = async (background) => {
    if (props.highScore < background.level) {
      return;
    }
    dispatch(MarketPlaceActions.pickBackground(background));
    if (currentUserId) {
      const userDocRef = doc(userCollectionRef, currentUserId);
      await updateDoc(userDocRef, {
        selectedBackground: background,
      });
      localforage.setItem(currentUserId + "_background", background);
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 750 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 750, min: 550 },
      items: 2,
    },

    smallMobile: {
      breakpoint: { max: 550, min: 0 },
      items: 1,
    },
  };

  return (
    <Carousel
      swipeable={true}
      // draggable={true}
      showDots={false}
      responsive={responsive}
      // ssr={true}
      autoPlaySpeed={1000}
      autoPlay={false}
      keyBoardControl={true}
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["smallMobile", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
      // centerMode={true}
    >
      {BackgroundData.map((background, index) => (
        <motion.div
          onClick={() => handleBackgroundClick(background)}
          className={
            background.url === chosenBackground.url
              ? `${classes.card} ${classes.chosen}`
              : classes.card
          }
          style={{ backgroundImage: `url(${background.url})` }}
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: index === 0 ? 0 : index * 0.1,
            duration: 0, 
          }}
        >
          {props.highScore < background.level && (
            <div className={classes.overlay}>Level: {background.level}</div>
          )}
        </motion.div>
      ))}
    </Carousel>
  );
};

export default Slider;
