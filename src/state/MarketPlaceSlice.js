import { createSlice, current } from "@reduxjs/toolkit";
import imageOne from '../images/imageOne.jpg'

const MarketPlaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    currentColours: ["70d6ff", "ff70a6", "ff9770", "ffd670", "e9ff70"],
    currentBackgroundData: {url: imageOne, opposingColour: 'rgb(57, 57, 57)'}
  },
  reducers: {
    pickScheme(state, action) {
      state.currentColours = action.payload
    },
    pickBackground(state,action) {
      state.currentBackgroundData = action.payload
    },
    clearState(state) {
      state.currentColours = ["70d6ff", "ff70a6", "ff9770", "ffd670", "e9ff70"]
      state.currentBackgroundData = {url: imageOne, opposingColour: 'rgb(57, 57, 57)'}
    }
  }
})

export default MarketPlaceSlice

export const MarketPlaceActions = MarketPlaceSlice.actions