import express from "express";
import {
  addToWhisList,
  editProfile,
  logout,
  me,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import { verifyUserToken } from "../middleware/authMiddleware.js";

const router = express.Router(); //Creando enrutador

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/logout", verifyUserToken, logout);
router.get("/me", verifyUserToken, me);
router.put("/whishlist_add", verifyUserToken, addToWhisList);
router.put("/edit_profile", verifyUserToken, editProfile);

export default router;
