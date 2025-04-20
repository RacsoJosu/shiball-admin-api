
import express, { Request, Response } from "express";
import { validateData } from "@middlewares/validatorData";
import { authGuard } from "@middlewares/auth";
import container from "@api/containers/container";

import { loginUserSchema, registerUserSchema } from "./auth.schemas";
import { AuthController } from "./auth.controller";
import { TYPES_AUTH } from "./auth.types";

const router = express.Router();
const authController = container.get<AuthController>(TYPES_AUTH.AuthController)

router.post("/signup", validateData(registerUserSchema), authController.postResgisterUser.bind(authController));
router.post("/login", validateData(loginUserSchema), authController.postLogiUser.bind(authController));
router.post("/logout", authGuard, authController.postLogoutUser.bind(authController));
router.get("/me", authGuard, authController.getUserAuthInfo.bind(authController));


router.get("/test", authGuard, function (req: Request, res: Response) {
    const { user } = req;
    res.status(200).json({
        user
    })
    
});



export default router;