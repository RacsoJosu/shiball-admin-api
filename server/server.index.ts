import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import {  prismaConnect} from "./config/prisma";
import { errorHandler } from "./middlewares/errorHandler";
import { useRouter } from "./api/router";


dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)

useRouter(app);
prismaConnect().then(() => { 
  app.listen(PORT, () => { 
  
      console.log("Server is running on port 3000");
  })

});
