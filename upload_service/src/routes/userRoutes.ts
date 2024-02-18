import {Router,Request,Response} from "express";
import simpleGit from "simple-git";
import { generate, getAllFiles } from "../utils/utils";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();
const userRouter = Router();

userRouter.post("/deploy",async (req:Request,res:Response)=>{
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = generate();
    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`));
    const files = getAllFiles(path.join(__dirname,`output/${id}`)); 
    files.forEach(async file=>{
        await uploadFile(file.slice(__dirname.length+1), file );
    });
    setTimeout(() => {
        publisher.lPush("build-queue",id);
        publisher.hSet("status",id,"uploaded");
        res.json({
            id:id
        });
    }, 5000);
});


userRouter.get("/status",async (req:Request,res:Response)=>{
    const id = req.query.id;
    const response = await subscriber.hGet("status",id as string);
    res.json({
        status:response
    });

})




export default userRouter;
