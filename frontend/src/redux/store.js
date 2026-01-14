// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice.js";
import favoReducer from "./slices/favoSlice.js";
import listingReducer from "./slices/listingSlice.js";
import bookingReducer from "./slices/bookingSlice.js";
import chatReducer from "./slices/chatSlice.js";

import { setupInterceptors } from "../api/axiosInstance.js";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "favorites", "booking", "chat"],
  // no persistir listings  vienen del back
};

const listingsPersistConfig = {
  key: "listings",
  storage,
  whitelist: ["my_listings"],
};

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  favorites: favoReducer,
  booking: bookingReducer,
  listings: persistReducer(listingsPersistConfig, listingReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistor = persistStore(store);

setupInterceptors(store);

export { store, persistor };
