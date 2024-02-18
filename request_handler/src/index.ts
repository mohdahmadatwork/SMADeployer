import express,{Request,Response} from "express";
import cors from "cors";
import { S3 } from "aws-sdk";
import { ACCESS_KEY,SECRET_ACCESS_KEY } from "./configurations/S3Config";

const app = express();
app.use(express.json());
app.use(cors());
const s3 = new S3({
    accessKeyId:ACCESS_KEY,
    secretAccessKey:SECRET_ACCESS_KEY
});

app.get("/*",async (req:Request,res:Response)=>{
    const host = req.hostname;
    console.log("host",host);
    const ids = host.split(".");
    const id = ids[0];
    console.log("id",id);
    const filepath = req.path;
    console.log(`dist/${id}${filepath}`);
    const contents = await s3.getObject({
        Bucket:"smavercel",
        Key: `dist/${id}${filepath}`
    }).promise();
    const type = filepath.endsWith("html")?"text/html":filepath.endsWith("css")?"text/css":"application/javascript";
    res.set("Content-Type",type);
    res.send(contents.Body);
});

app.listen(5000,()=>{
    console.log("Request handlesr listening at 5000");
})