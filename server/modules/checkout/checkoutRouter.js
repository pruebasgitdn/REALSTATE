import express from "express";
import { verifyUserToken } from "../../middleware/authMiddleware.js";
import {
  getUserPurchases,
  getUserSales,
  goToPay,
  gotoPayBooking,
  verifyPay,
  verifyBookingPay,
} from "./checkoutController.js";

const router = express.Router();

router.post("/activos", verifyUserToken, goToPay);
router.post("/paybooking", verifyUserToken, gotoPayBooking);
router.get("/verifypay", verifyUserToken, verifyPay);

router.get("/verifybookingpay", verifyUserToken, verifyBookingPay);

router.get("/user_purchases", verifyUserToken, getUserPurchases);
router.get("/user_sales", verifyUserToken, getUserSales);

export default router;
