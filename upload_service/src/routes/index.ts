import { Router } from "express";
import userRouter from "./userRoutes";
import cors from "cors";
const mainRouter = Router();
mainRouter.use(cors());
mainRouter.use("/user",userRouter);


export default mainRouter;