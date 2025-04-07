import {
    Router
} from "express";
import { postResgisterManyUser } from "./seed.controller";
const router = Router()


router.get("/usuarios", postResgisterManyUser)

export default router