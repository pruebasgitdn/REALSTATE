import axios from "axios";
import { setLogout } from "../redux/slices/userSlice";
import { clearFavo } from "../redux/slices/favoSlice";
import { setClearMyListings } from "../redux/slices/listingSlice";
import { API_BASE_URL } from "../env.js";

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000,
  withCredentials: true,
});

//cortafuegos inyeccion store rdx
export const setupInterceptors = (store) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Sesion expirada");
        console.log(error.response.message);

        // store.dispatch(setLogout());
        // store.dispatch(clearFavo());
        // store.dispatch(setClearMyListings());

        // globalThis.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};
export default api;
