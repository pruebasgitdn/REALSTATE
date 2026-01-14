import express from "express";
import { verifyUserToken } from "../../middleware/authMiddleware.js";
import {
  AllPropertys,
  createListing,
  filterListings,
  GetLlistingById,
  getMyReservations,
  getUserListingsByID,
  ListingsHomeByCategory,
  ownListings,
  searchListing,
  setStatus,
} from "./listingController.js";
import {
  validateCreateListing,
  validateFilterListings,
  validateListingID,
  validateSearchListing,
  validateSetStatus,
  validateUserID,
} from "./validators.js";

const router = express.Router();

router.post(
  "/createlisting",
  verifyUserToken,
  validateCreateListing,
  createListing
);

router.get("/mylistings", verifyUserToken, ownListings);

router.get("/propertys/:category", ListingsHomeByCategory);

router.get("/all_propertys", AllPropertys);

router.get("/property_id/:id", validateListingID, GetLlistingById);

router.put(
  "/property_setstatus/:id",
  validateSetStatus,
  verifyUserToken,
  setStatus
);

router.get("/my_reservations", verifyUserToken, getMyReservations);

router.get("/search", validateSearchListing, searchListing);

router.get("/filter", validateFilterListings, filterListings);

router.get("/get_user_listings/:id", validateUserID, getUserListingsByID);

export default router;
