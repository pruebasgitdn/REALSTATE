import { createSlice } from "@reduxjs/toolkit";
import { createBooking, getTripList } from "../thunks/bookingThunk";

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

export const bookingSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    syncUserBooking: (state, action) => {
      state.bookings = action.payload;
    },

    clearBooking: (state) => {
      state.bookings = [];
      state.loading = false;
      state.error = null;
    },

    removeFromBooking: (state, action) => {
      state.bookings = state.bookings
        .flat()
        .filter((item) => item.publicacionId._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.paylaod?.message || action.payload?.error;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getTripList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTripList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.payload?.message;
      })
      .addCase(getTripList.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      });
  },
});

export const { addBooking, removeFromBooking, syncUserBooking, clearBooking } =
  bookingSlice.actions;

export default bookingSlice.reducer;
