import { S3 } from "aws-sdk";
import path from "path";
import { ACCESS_KEY, SECRET_ACCESS_KEY } from "../configurations/S3Config";
import fs from "fs";
import { getAllFiles } from "../utils/utils";
const s3 = new S3({
    accessKeyId:ACCESS_KEY,
    secretAccessKey:SECRET_ACCESS_KEY
})
export async function downloadS3Folder (prefix : string,dir:string){
    const allFiles = await s3.listObjectsV2({
        Bucket:"smavercel",
        Prefix:prefix
    }).promise();


    const allPromises = allFiles.Contents?.map(async ({Key})=>{
        const key = Key?Key:"";
        const finalOutputPath = path.join(dir,key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName,{recursive:true});
        }
        s3.getObject({
            Bucket:"smavercel",
            Key:key || ""
        }).createReadStream().pipe(outputFile);
    }) || [];


    await Promise.all(allPromises?.filter(X=> X !==undefined));
}
export const uploadFile = async (fileName: string, localFilePath: string) =>{
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body:fileContent,
        Bucket:"smavercel",
        Key:fileName.replace(/\\/g, '/')
    }).promise();
    console.log(response);
}
export function copyFinalDist (id:string,dir:string){
    const folderPath = path.join(dir,`output/${id}/build`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach((file)=>{
        uploadFile(`dist/${id}/`+file.slice(folderPath.length+1),file);
    });
    
}