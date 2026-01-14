import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../api/request";
import { API_BASE_URL } from "../../env.js";

export const getUsersMessages = createAsyncThunk(
  "messages/getUsersMessages",
  async (user_id, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/messages/${user_id}`;
    const data = await request({
      url: endpoint,
      method: "GET",
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    return data.data.map((item) => ({
      senderId: item.senderId,
      receiverId: item.receiverId,
      data: {
        text: item.text,
      },
    }));
  }
);

export const sendMessageThunk = createAsyncThunk(
  "messages/sendMessage",
  async ({ user_id, payload }, { rejectWithValue }) => {
    const endpoint = `${API_BASE_URL}/api/messages/send/${user_id}`;
    const data = await request({
      url: endpoint,
      method: "POST",
      data: {
        text: payload,
      },
    });

    if (!data.success) {
      return rejectWithValue(data.message);
    }

    const item = data.data;

    return {
      senderId: item.senderId,
      receiverId: item.receiverId,
      data: {
        text: item.text,
      },
    };
  }
);
