import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../api/request";
import { API_BASE_URL } from "../../env.js";

export const getTripList = createAsyncThunk(
  "booking/getTripList",
  async (_, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/booking/triplist`;
    const data = await request({
      url: endpoint,
      method: "GET",
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data.data.map((item) => ({
      publicacion: item.publicacionId,
      anfitrion: item.anfitrionId,
      booking_data: {
        fechaInicio: item.fechaInicio,
        fechaFin: item.fechaFin,
        precioTotal: item.precioTotal,
      },
    }));
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/booking/createbooking`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: payload,
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data.data;
  }
);
