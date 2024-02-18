import express from "express";
import cors from "cors";
import mainRouter from "./routes";
import { uploadFile } from "./routes/aws";

const app = express();
app.use(express.json());
app.use("/api/v1",mainRouter);


app.use(cors());


app.listen(3000,()=>{
    console.log("Backend listening on the port 3000!");
})