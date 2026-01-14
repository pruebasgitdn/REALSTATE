import { createSlice } from "@reduxjs/toolkit";
import {
  createListing,
  getAllListingsThunk,
  getListingsByCategorie,
  getOwnListings,
  setStatusListing,
} from "../thunks/listingThunk";

const initialState = {
  listings: [],
  my_listings: [],
  error: null,
  loading: false,
};

export const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setAllListings: (state, action) => {
      state.listings = action.payload;
    },
    addListing: (state, action) => {
      const exists = state.my_listings.some(
        (listing) => listing._id === action.payload._id
      );

      if (!exists) {
        state.my_listings.push(action.payload);
      }
    },

    setClearState: (state) => {
      state.listings = [];
      state.my_listings = [];
      state.error = null;
    },
    setMyListings: (state, action) => {
      state.my_listings = action.payload;
    },

    setClearMyListings: (state) => {
      state.my_listings = [];
    },
    setUpdateMyListings: (state, action) => {
      state.my_listings = {
        ...state.my_listings,
        ...action.payload,
      };
    },
    removeMyListingById: (state, action) => {
      const id = action.payload;
      state.my_listings = state.my_listings.filter(
        (listing) => listing._id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllListingsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllListingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllListingsThunk.fulfilled, (state, action) => {
        state.listings = action.payload.listings;
        state.loading = false;
      })
      .addCase(getListingsByCategorie.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListingsByCategorie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getListingsByCategorie.fulfilled, (state, action) => {
        state.listings = action.payload.listings;
        state.loading = false;
      })
      .addCase(getOwnListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOwnListings.fulfilled, (state, action) => {
        state.my_listings = action.payload.listings;
        state.loading = false;
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.my_listings = [...state.my_listings, action.payload];
        state.loading = false;
      })
      .addCase(setStatusListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(setStatusListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setStatusListing.fulfilled, (state, action) => {
        const listing_id = action.payload.data._id;

        state.my_listings = state.my_listings.map((p) =>
          p._id === listing_id ? action.payload.data : p
        );

        state.loading = false;
      });
  },
});

export const {
  setAllListings,
  setClearState,
  setMyListings,
  setUpdateMyListings,
  setClearMyListings,
  addListing,
  removeMyListingById,
} = listingSlice.actions;

export default listingSlice.reducer;
