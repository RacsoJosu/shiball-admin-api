import express from "express";

import usersRouter from "./users/users.router";
import authRouter from "./auth/auth.router";
import seedRouter from "./seed/seed.router"



export function getRouter() {
    const router = express.Router();
    router.use("/auth", authRouter);
    router.use("/usuarios", usersRouter)
    router.use("/seed", seedRouter)

    return router
}