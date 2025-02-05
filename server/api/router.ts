import express,{ Request, Response, Express } from "express";
import { prisma } from "../config/prisma";
import usersRouter from "./users/users.router";


export function useRouter(app: Express) { 
    
    app.get("/", async (req:Request, res:Response) => {
        const users = await prisma.user.findMany();
        res.status(200).json({ title: "Usuarios listados", success: true, data: users });
    });
    app.use("/api", getRouter());
    app.all("*", (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` });
    });

}


function getRouter() {
    const router = express.Router();
    router.use("/users", usersRouter);
    return router
}