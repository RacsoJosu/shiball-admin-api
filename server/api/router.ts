import express from "express";

import usersRouter from "@api/users/users.router";
import authRouter from "@api/auth/auth.router";
import seedRouter from "@api/seed/seed.router"



export function getRouter() {
    const router = express.Router();
    router.use("/auth", authRouter);
    router.use("/usuarios", usersRouter)
    router.use("/seed", seedRouter)

    return router
}