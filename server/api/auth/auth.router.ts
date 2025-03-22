
import express, { Request, Response } from "express";
import { getUserAuthInfo, postLogiUser, postLogoutUser, postResgisterUser } from "./auth.controller";
import { validateData } from "../../middlewares/validatorData";
import { loginUserSchema, registerUserSchema } from "./auth.schemas";
import {  authGuard } from "../../middlewares/auth";


const router = express.Router();

router.post("/registrar", validateData(registerUserSchema), postResgisterUser);
router.post("/login", validateData(loginUserSchema), postLogiUser);
router.post("/logout", authGuard, postLogoutUser)
router.get("/me", authGuard, getUserAuthInfo)

router.get("/test", authGuard, function (req: Request, res: Response) {
    const { user } = req;
    res.status(200).json({
        user
    })
    
});



export default router;