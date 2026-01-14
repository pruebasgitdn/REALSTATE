import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../api/request";
import { API_BASE_URL } from "../../env.js";

export const payThunkActivos = createAsyncThunk(
  "checkout/payThunkActivos",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/checkout/activos`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: {
        item: payload,
      },
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data.url;
  }
);

export const payBookingThunk = createAsyncThunk(
  "checkout/payBookingThunk",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/checkout/paybooking`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: payload,
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }
    return data.url;
  }
);

export const verifyPayBooking = createAsyncThunk(
  "checkout/verifyPayBooking",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/checkout/verifybookingpay?id_session=${payload}`;
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

export const getUserPurchasesThunk = createAsyncThunk(
  "checkout/getUserPurchasesThunk",
  async (_, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/checkout/user_purchases`;
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

export const getUserSalesThunk = createAsyncThunk(
  "checkout/getUserSalesThunk",
  async (_, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/checkout/user_sales`;
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
