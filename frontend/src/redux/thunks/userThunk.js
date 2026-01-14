import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../api/request";
import { clearFavo } from "../slices/favoSlice";
import { getOwnListings } from "./listingThunk";
import { setClearMyListings } from "../slices/listingSlice";
import { getUsersFavo } from "./favoThunk";
import { getTripList } from "./bookingThunk";
import { clearChatState } from "../slices/chatSlice";
import { connectSocket } from "../../lib/socket.jsx";
import { clearBooking } from "../slices/bookingSlice.js";
import { API_BASE_URL } from "../../env.js";

export const verifySession = createAsyncThunk(
  "user/verifySession",
  async (_, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/user/me`;
    const data = await request({
      url: endpoint,
      method: "GET",
    });

    console.log(data);

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data;
  }
);

export const connecSocketThunk = createAsyncThunk(
  "socket/connectSocket",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const { user, isAuthenticated, socketConnected } = state.user;

    if (!isAuthenticated || !user) {
      return rejectWithValue({ message: "Usuario no autenticado" });
    }

    if (socketConnected) {
      return rejectWithValue({ message: "Socket ya conectado" });
    }

    const socket = connectSocket(user._id, dispatch);

    socket.on("getOnlineUsers", (users) => {
      console.log("Usuarios online:", users);
    });

    return true;
  }
);

export const initSession = createAsyncThunk(
  "user/initSession",
  async (payload, { rejectWithValue, dispatch }) => {
    const endpoint = `${API_BASE_URL}/api/user/login`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: payload,
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    // sincronizar la informacion personal
    // coger mis publicaciones
    await dispatch(getOwnListings());

    // coger los favoritos
    await dispatch(getUsersFavo());

    // obtener bookings (reservas)
    await dispatch(getTripList());

    return data;
  }
);

export const registerUserThunk = createAsyncThunk(
  "user/registerUserThunk",
  async (payload, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/user/register`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: payload,
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data;
  }
);

export const logoutSession = createAsyncThunk(
  "user/logoutSession",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const endpoint = `${API_BASE_URL}/api/user/logout`;
      const response = await request({
        url: endpoint,
        method: "GET",
      });

      dispatch(clearFavo());
      dispatch(setClearMyListings());
      dispatch(clearChatState());
      dispatch(clearBooking());

      return response;
    } catch (error) {
      console.error("Error", error);
      console.error("Error message", error.message);

      return rejectWithValue(error.message || "Error al cerrar sesión");
    }
  }
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const endpoint = `${API_BASE_URL}/api/user/edit_profile`;
      const response = await request({
        url: endpoint,
        method: "PUT",
        data: payload,
      });

      if (!response.success) {
        rejectWithValue(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error", error);
      console.error("Error message", error.message);

      return rejectWithValue(error.message || "Error al cerrar sesión");
    }
  }
);

export const getUserByIdThunk = createAsyncThunk(
  "user/getUserByIdThunk",
  async (payload, { rejectWithValue }) => {
    try {
      const endpoint = `${API_BASE_URL}/api/user/get_user/${payload}`;
      const response = await request({
        url: endpoint,
        method: "GET",
      });

      if (!response.success) {
        rejectWithValue(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error", error);
      console.error("Error message", error.message);

      return rejectWithValue(error.message || "Error al cerrar sesión");
    }
  }
);
