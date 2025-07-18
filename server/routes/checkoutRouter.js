import express from "express";
import { verifyUserToken } from "../middleware/authMiddleware.js";
import {
  getUserPurchases,
  getUserSales,
  goToPay,
  verifyPay,
} from "../controllers/checkoutController.js";

const router = express.Router();

//SALE
router.post("/activos", verifyUserToken, goToPay);
router.get("/user_purchases", verifyUserToken, getUserPurchases);
router.get("/user_sales", verifyUserToken, getUserSales);
router.get("/verifypay", verifyUserToken, verifyPay);

export default router;
