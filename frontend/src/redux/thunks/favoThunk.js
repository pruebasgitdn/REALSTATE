import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../api/request";
import { API_BASE_URL } from "../../env.js";

export const getUsersFavo = createAsyncThunk(
  "favo/getUsersFavo",
  async (_, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/favo/getusersfavo`;
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

export const deleteFromFavo = createAsyncThunk(
  "favo/deleteFromFavo",
  async ({ clientID, listingID }, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/favo/removefromfavo`;
    const data = await request({
      url: endpoint,
      method: "DELETE",
      data: {
        clientID,
        listingID,
      },
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data.data;
  }
);

export const addToFavoThunk = createAsyncThunk(
  "favo/addToFavoThunk",
  async ({ clientID, listingID }, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/favo/addtofavo`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: {
        clientID,
        listingID,
      },
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data.data;
  }
);
