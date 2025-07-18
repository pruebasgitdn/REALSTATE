import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  listings: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    setTripList: (state, action) => {
      state.user = {
        ...state.user, // Copia las demás propiedades de `user`
        tripList: action.payload, // Actualiza solo `tripList`
      };
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user, // Copia el estado actual del usuario
        ...action.payload, // Actualiza con las propiedades enviadas
      };
    },
  },
});

export const { setLogin, setLogout, setListings, setTripList, updateUser } =
  userSlice.actions;

export default userSlice.reducer;
