import { createSlice } from "@reduxjs/toolkit";
import { deleteFromFavo, getUsersFavo } from "../thunks/favoThunk";

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

    clearFavo: (state) => {
      state.favorites = [];
      state.loading = false;
      state.error = null;
    },

    removeFromFavo: (state, action) => {
      state.favorites = state.favorites
        .flat()
        .filter((item) => item.publicacionId._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersFavo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersFavo.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })
      .addCase(getUsersFavo.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.loading = false;
      })

      .addCase(deleteFromFavo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFromFavo.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })
      .addCase(deleteFromFavo.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { addToFavo, removeFromFavo, syncUserFavo, clearFavo } =
  favoSlice.actions;

export default favoSlice.reducer;
