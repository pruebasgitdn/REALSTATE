import express from "express";
import { verifyUserToken } from "../../middleware/authMiddleware.js";
import {
  addToFavoDB,
  getUsersFavo,
  removeFromFavoDB,
  getUsersFavoTT,
} from "../favorites/favoriteController.js";
import { validateAddToFavo, validateRemoveFromFavo } from "./validators.js";

const router = express.Router();

router.post("/addtofavo", verifyUserToken, validateAddToFavo, addToFavoDB);

router.delete(
  "/removefromfavo",
  verifyUserToken,
  validateRemoveFromFavo,
  removeFromFavoDB
);

router.get("/getusersfavo", verifyUserToken, getUsersFavo);

router.get("/getusersfavoremix", verifyUserToken, getUsersFavoTT);

export default router;
