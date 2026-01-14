import { createSlice } from "@reduxjs/toolkit";
import { getUsersMessages, sendMessageThunk } from "../thunks/chatThunk";

const initialState = {
  chat_selected: false,
  loading: false,
  chat: null,
  online_users: [],
  error: null,
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    unselectChat: (state) => {
      state.chat_selected = false;
      state.messages = [];
      state.chat = null;
      state.error = null;
    },

    selectChat: (state, action) => {
      state.chat_selected = true;
      state.chat = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.online_users = action.payload;
    },

    clearChatState: (state) => {
      state.chat_selected = false;
      state.online_users = [];
      state.loading = false;
      state.chat = null;
      state.error = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message);
      })
      .addCase(getUsersMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })

      .addCase(sendMessageThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message);
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      });
  },
});

export const {
  addMessage,
  clearChatState,
  unselectChat,
  selectChat,
  setOnlineUsers,
} = chatSlice.actions;

export default chatSlice.reducer;
