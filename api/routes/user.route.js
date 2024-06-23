import express from "express";
import { signout, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.put("/userjoin");
router.post("/signout", signout);

export default router;
