// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state";

const store = configureStore({
  reducer: {
    user: userReducer, // Define el reducer aquí
  },
  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  const state = store.getState();
  if (state.user?.user) {
    localStorage.setItem("user", JSON.stringify(state.user.user));
    localStorage.setItem("token", state.user.token);
  }
});

export default store;
