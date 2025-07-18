// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userState.js";
import favoReducer from "./favoState.js";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "favorites"], // estados
};

const rootReducer = combineReducers({
  user: userReducer,
  favorites: favoReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: {
    persistedReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
