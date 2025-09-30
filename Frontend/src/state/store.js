import { configureStore } from "@reduxjs/toolkit";
import stocksReducer from "../state/stockSlice";
import socialReducer from "../state/socialSlice";
import authReducer from "../state/authSlice";

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    social: socialReducer,
    auth  : authReducer,
  },
});
