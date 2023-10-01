import { createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase/config";
import { doc, updateDoc, collection } from "firebase/firestore";

// const moviesCollectionRef = collection(db, "users");

const gameplaySlice = createSlice({
  name: "gameplay",
  initialState: {
    score: 0,
    highScore: 0,
    currentValue: 0,
    targetValue: Math.floor(Math.random() * 9 + 1),
    startingSpeed: 700,
    difficulty: "Easy",
    lost: false,
    inGame: false,
  },
  reducers: {
    handleRestart(state) {
      state.score = 0;
      state.currentValue = 0;
      state.targetValue = Math.floor(Math.random() * 9 + 1);
      state.lost = false;
      state.inGame = true;
    },
    handleCurrentValueClick(state) {
      state.score++;
      state.currentValue = 0;
      state.targetValue = Math.floor(Math.random() * 9 + 1);
    },
    setLoss(state) {
      state.lost = true;
      state.inGame = false;
    },
    incrementCurrentValue(state) {
      state.currentValue++;
    },
    changeDifficulty(state, action) {
      if (!state.inGame) {
        state.startingSpeed = action.payload.startingSpeed;
        state.difficulty = action.payload.difficulty;
      }
    },
    updateHighScore(state, action) {
      if (action.payload > state.highScore) {
        state.highScore = action.payload;
      }
    },
    setInitialAccountHighScore(state, action) {
      state.highScore = action.payload;
    },
    handleStartGame(state, action) {
      state.inGame = action.payload;
    },
  },
});

export default gameplaySlice;
export const gameplayActions = gameplaySlice.actions;

export const updateHighScoreAsync = (newScore) => {
  return async (dispatch, getState) => {
    const state = getState();
    const userId = state.ui.userData ? state.ui.userData.uid : null;
    const { highScore } = state.gameplay;

    console.log(`New Score: ${newScore}`);
    console.log(`High Score: ${highScore}`);
    console.log(`User ID: ${userId}`);

    if (newScore > highScore && userId) {
      dispatch(gameplayActions.updateHighScore(newScore));

      try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { highScore: newScore });
      } catch (error) {
        console.error("Error updating high score: ", error);
      }
    }
  };
};
