import express from "express";

import usersRouter from "./users/users.router";
import authRouter from "./auth/auth.router";




export function getRouter() {
    const router = express.Router();
    router.use("/auth", authRouter);

    return router
}