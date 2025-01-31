import express from "express";
import { verifyUserToken } from "../middleware/authMiddleware.js";
import {
  AllPropertys,
  createListing,
  GetLlistingById,
  getMyReservations,
  ListingsHomeByCategory,
  ownListings,
  searchListing,
  setStatus,
} from "../controllers/listingController.js";

const router = express.Router(); //Creando enrutador

router.get("/mylistings", verifyUserToken, ownListings);

router.get("/propertys/:category", ListingsHomeByCategory);

router.get("/propertys", AllPropertys);

router.get("/property_id/:id", GetLlistingById);
router.post("/createlisting", verifyUserToken, createListing);
router.put("/property_setstatus/:id", verifyUserToken, setStatus);
router.get("/my_reservations", verifyUserToken, getMyReservations);

router.get("/search", searchListing);

export default router;
