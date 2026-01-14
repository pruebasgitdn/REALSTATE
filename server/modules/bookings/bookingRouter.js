import express from "express";
import { verifyUserToken } from "../../middleware/authMiddleware.js";
import { createBooking, getTripList } from "./bookingController.js";
import { validateCreateBooking } from "./validators.js";
const router = express.Router(); //enrutador

router.post(
  "/createbooking",
  verifyUserToken,
  validateCreateBooking,
  createBooking
);
router.get("/triplist", verifyUserToken, getTripList);

export default router;
