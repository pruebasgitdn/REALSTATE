import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useDispatch } from "react-redux";
import { setLogin } from "./redux/state";
import { useEffect } from "react";
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
//nazi
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (user && token) {
      dispatch(setLogin({ user: user, token: token }));
    }
  }, [dispatch]);

  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          {/* PUBLIC */}
          <Route element={<HomePage />} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<ListingDetails />} path="/property_id/:id" />
          <Route element={<SearchResults />} path="/search" />

          {/*PVT*/}
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
