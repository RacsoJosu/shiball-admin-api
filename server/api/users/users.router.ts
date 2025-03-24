
import express from "express";
import { getAllUsers } from "./user.controller";
import { authGuard } from "../../middlewares/auth";

const router = express.Router();

router.get("",authGuard, getAllUsers);

export default router;