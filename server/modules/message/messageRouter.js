import express from "express";
import { verifyUserToken } from "../../middleware/authMiddleware.js";
import { validateParamsId } from "./validators.js";
import { getMessages, sendMessage } from "./messageController.js";
const router = express.Router();

router.get("/:id", verifyUserToken, validateParamsId, getMessages);

router.post("/send/:id", verifyUserToken, sendMessage);

export default router;
