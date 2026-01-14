import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NavBar from "./components/NavBar";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./components/ListingDetails";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import ProtectedRoutes from "./components/ProtectedRoutes";
import EditProfile from "./pages/EditProfile";
import PropertyList from "./pages/PropertyList";
import ReservationList from "./pages/ReservationList";
import SearchResults from "./pages/SearchResults";
import MySales from "./components/MySales.jsx";
import Success from "./components/Success.jsx";
import Cancel from "./components/Cancel.jsx";
import SuccessBooking from "./components/SuccessBooking.jsx";
import UserPage from "./pages/UserPage.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connecSocketThunk, verifySession } from "./redux/thunks/userThunk.js";
import { setLogout } from "./redux/slices/userSlice.js";
import { clearFavo } from "./redux/slices/favoSlice.js";
import { setClearMyListings } from "./redux/slices/listingSlice.js";
import { clearChatState } from "./redux/slices/chatSlice.js";
import { clearBooking } from "./redux/slices/bookingSlice.js";

function App() {
  const isAuth = useSelector((state) => state?.user?.isAuthenticated);
  const socketConnected = useSelector((state) => state?.user?.socketConnected);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchU = async () => {
      if (isAuth) return;
      try {
        await dispatch(verifySession()).unwrap();
      } catch (error) {
        console.log(error);
        dispatch(setLogout());
        dispatch(clearFavo());
        dispatch(setClearMyListings());
        dispatch(clearBooking());
        dispatch(clearChatState());
      }
    };

    fetchU();
  });

  useEffect(() => {
    if (isAuth && !socketConnected) {
      dispatch(connecSocketThunk());
    }
  }, [dispatch, isAuth, socketConnected]);
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<ListingDetails />} path="/property_id/:id" />
        <Route element={<UserPage />} path="/get_user/:id" />
        <Route element={<SearchResults />} path="/search" />

        <Route
          element={
            <ProtectedRoutes>
              <CreateListing />
            </ProtectedRoutes>
          }
          path="/create-listing"
        />
        <Route
          element={
            <ProtectedRoutes>
              <PropertyList />
            </ProtectedRoutes>
          }
          path="/property_list"
        />

        <Route
          element={
            <ProtectedRoutes>
              <EditProfile />
            </ProtectedRoutes>
          }
          path="/edit_profile"
        />

        <Route
          element={
            <ProtectedRoutes>
              <ReservationList />
            </ProtectedRoutes>
          }
          path="/reservation_list"
        />

        <Route
          element={
            <ProtectedRoutes>
              <TripList />
            </ProtectedRoutes>
          }
          path="/trip_list"
        />
        <Route
          element={
            <ProtectedRoutes>
              <WishList />
            </ProtectedRoutes>
          }
          path="/wish_list"
        />
        <Route
          element={
            <ProtectedRoutes>
              <MySales />
            </ProtectedRoutes>
          }
          path="/my_sales"
        />
        <Route
          element={
            <ProtectedRoutes>
              <Success />
            </ProtectedRoutes>
          }
          path="/success"
        />
        <Route
          element={
            <ProtectedRoutes>
              <Cancel />
            </ProtectedRoutes>
          }
          path="/cancel"
        />
        <Route
          element={
            <ProtectedRoutes>
              <SuccessBooking />
            </ProtectedRoutes>
          }
          path="/successbooking"
        />
      </Routes>
    </Router>
  );
}

export default App;
