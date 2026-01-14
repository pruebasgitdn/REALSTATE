import { createSlice } from "@reduxjs/toolkit";
import {
  editProfile,
  initSession,
  logoutSession,
  connecSocketThunk,
  verifySession,
} from "../thunks/userThunk";
import { REHYDRATE } from "redux-persist";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  socketConnected: false,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.socketConnected = false;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const userState = action.payload?.user;

      if (userState?.isAuthenticated) {
        const isLoggedIn = document.cookie.includes("isLoggedIn=true");

        if (isLoggedIn) {
          // restaurar usuario
          state.user = userState.user;
          state.token = userState.token;
          state.isAuthenticated = true;
        } else {
          // limpiar estado
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    });
    builder
      .addCase(verifySession.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifySession.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        console.log(action.payload);
        // state.user = action.payload;
        // state.loading = false;
      })
      .addCase(initSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(initSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(initSession.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.loading = false;
        state.user = user;
        state.isAuthenticated = true;
        state.token = token;
      })
      .addCase(connecSocketThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(connecSocketThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(connecSocketThunk.fulfilled, (state) => {
        state.socketConnected = true;
        state.loading = false;
      })
      .addCase(logoutSession.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
      })
      .addCase(logoutSession.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutSession.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.socketConnected = false;
      })
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      });
  },
});

export const { setLogin, setLogout, updateUser } = userSlice.actions;

export default userSlice.reducer;
