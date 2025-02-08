
import express from "express";
import { postLogiUser, postResgisterUser } from "./auth.controller";
import { validateData } from "../../middlewares/validatorData";
import { loginUserSchema, registerUserSchema } from "./auth.schemas";

const router = express.Router();

router.post("/registrar", validateData(registerUserSchema), postResgisterUser);
router.post("/login", validateData(loginUserSchema), postLogiUser);


export default router;