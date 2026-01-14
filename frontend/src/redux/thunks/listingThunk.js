import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../api/request";
import { API_BASE_URL } from "../../env.js";

export const getAllListingsThunk = createAsyncThunk(
  "listings/AllListings",
  async (_, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/listing/all_propertys`;
    const data = await request({
      url: endpoint,
      method: "GET",
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data;
  }
);

export const getOwnListings = createAsyncThunk(
  "listings/getOwnListings",
  async (_, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/listing/mylistings`;
    const data = await request({
      url: endpoint,
      method: "GET",
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data;
  }
);

export const getListingsByCategorie = createAsyncThunk(
  "listings/listingsByCategorie",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/listing/propertys/${payload}`;
    const data = await request({
      url: endpoint,
      method: "GET",
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data;
  }
);

export const createListing = createAsyncThunk(
  "listings/createListing",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/listing/createlisting`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: payload,
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    //dispatch del user.my_listings? si

    return data.data;
  }
);

export const setStatusListing = createAsyncThunk(
  "listings/setStatusListing",
  async ({ id, estado }, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/listing/property_setstatus/${id}`;
    const data = await request({
      url: endpoint,
      method: "PUT",
      data: { estado },
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data;
  }
);

export const getUserListingsByIdThunk = createAsyncThunk(
  "listings/getUserListingsByIdThunk",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/listing/get_user_listings/${payload}`;
    const data = await request({
      url: endpoint,
      method: "GET",
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data.data;
  }
);
