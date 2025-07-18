import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

export const favoSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavo: (state, action) => {
      state.favorites.push(action.payload);
    },
    syncUserFavo: (state, action) => {
      state.favorites = action.payload;
    },

    removeFromFavo: (state, action) => {
      state.favorites = state.favorites
        .flat()
        .filter((item) => item.publicacionId !== action.payload);
    },
    clearFavo: (state) => {
      state.favorites = [];
    },
  },
});

export const { addToFavo, removeFromFavo, syncUserFavo, clearFavo } =
  favoSlice.actions;

export default favoSlice.reducer;
