import express from "express";
import {
  AllUsers,
  editProfile,
  getUserByID,
  logout,
  me,
  userLogin,
  userRegister,
} from "./userController.js";
import { verifyUserToken } from "../../middleware/authMiddleware.js";
import {
  editProfileValidation,
  loginValidation,
  registerValidation,
  validateGetUserByID,
} from "./validators.js";
import { preventIfLoggedIn } from "../../middleware/preventLoggedIn.js";

const router = express.Router();

router.post("/register", registerValidation, userRegister);

router.post("/login", loginValidation, userLogin);

router.get("/logout", verifyUserToken, logout);
router.get("/me", verifyUserToken, me);

router.get("/get_user/:id", validateGetUserByID, getUserByID);

router.get("/all_users", AllUsers);

router.put(
  "/edit_profile",
  verifyUserToken,
  editProfileValidation,
  editProfile
);

export default router;
