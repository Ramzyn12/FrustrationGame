import React from "react";
import classes from "./Paused.module.css";

const Paused = (props) => {


  return (
    <div className={classes.overlay}>
      <div className={classes.container}>
        <h1>Paused</h1>
        <div className={classes.controls}>
          <button onClick={props.onRestart}>Restart</button>
          <button onClick={props.onResume}>Resume</button>
          <button onClick={props.onHome}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default Paused;
