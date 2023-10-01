import React from 'react';
import classes from './ToggleSwitch.module.css';

const ToggleSwitch = (props) => {

  return (
    <label className={classes.switch}>
      <input type="checkbox" onChange={() => props.onToggle()}/>
      <span className={`${classes.slider} ${classes.round}`}></span>
    </label>
  );
};

export default ToggleSwitch;
