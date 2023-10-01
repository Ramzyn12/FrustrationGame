import { configureStore } from "@reduxjs/toolkit";
import uiStateSlice from "./uiStateSlice";
import gameplaySlice from "./gameplaySlice";
import MarketPlaceSlice from "./MarketPlaceSlice";

export const store = configureStore({
  reducer: {
    ui: uiStateSlice.reducer,
    gameplay: gameplaySlice.reducer,
    marketplace: MarketPlaceSlice.reducer,
  },
});
