
import express from "express";
import { authGuard } from "../../middlewares/auth";
import { UserController } from "./user.controller";
import TYPES_USER from "./user.types";
import container from "../containers/container";

const userController = container.get<UserController>(TYPES_USER.UserController);
const router = express.Router();

router.get("/",authGuard, userController.getAllUsers.bind(userController));

export default router;