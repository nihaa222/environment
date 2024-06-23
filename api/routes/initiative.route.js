import express from "express";

import {
  category,
  createInitiative,
  deleteJoinedInitiatives,
  flowerInitiative,
  getInitiatives,
  getPeople,
  getPulp,
  getainitiative,
  joining,
  joinornot,
  notjoining,
} from "../controllers/initiative.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/createInitiative", createInitiative);
router.get("/getainitiative/:id", getainitiative);
router.get("/joinornot/:userId", verifyToken, joinornot);
router.get("/getInitiatives", getInitiatives);
router.get("/category/:category", category);
router.put("/joining", joining);
router.put("/notjoining", notjoining);

router.put("/flowerInitiative", flowerInitiative);
router.get("/getPeople", getPeople);
router.delete("/deletejoin/:userId", deleteJoinedInitiatives);
export default router;
