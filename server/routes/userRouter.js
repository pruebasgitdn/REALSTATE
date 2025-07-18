import express from "express";
import {
  addToFavoDB,
  editProfile,
  getUsersFavo,
  getUsersFavoTT,
  logout,
  me,
  removeFromFavoDB,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import { verifyUserToken } from "../middleware/authMiddleware.js";

const router = express.Router(); //Creando enrutador

//USER
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/logout", verifyUserToken, logout);
router.get("/me", verifyUserToken, me);
router.put("/edit_profile", verifyUserToken, editProfile);

//FAVO
router.post("/addtofavo", verifyUserToken, addToFavoDB);
router.post("/removefromfavo", verifyUserToken, removeFromFavoDB);
router.get("/getusersfavo", verifyUserToken, getUsersFavo);
router.get("/getusersfavoremix", verifyUserToken, getUsersFavoTT);

//SALE
// router.post("/activos", verifyUserToken, getUsersFavo);

export default router;
