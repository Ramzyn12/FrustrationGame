//includes things like dark mode, logged in state etc...

import { createSlice } from "@reduxjs/toolkit";


const uiStateSlice = createSlice({
  name: 'ui',
  initialState: {loggedIn: false, userData: null, darkMode: true},
  reducers: {
    toggleLoggedIn(state, action) {
      state.loggedIn = action.payload
    },
    updateCurrentUser(state, action) {
      state.userData = action.payload ? action.payload : null
    },
    toggleDarkMode(state, action) {
      state.darkMode = action.payload
    }
  }
})

export default uiStateSlice
export const uiStateActions = uiStateSlice.actions