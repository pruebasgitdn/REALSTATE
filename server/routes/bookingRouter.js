import express from "express";
import { verifyUserToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getTripList,
  ss,
} from "../controllers/bookingController.js";
const router = express.Router(); //enrutador

router.post("/createbooking", verifyUserToken, createBooking);
router.get("/ss", verifyUserToken, ss);
router.get("/triplist", verifyUserToken, getTripList);

export default router;
