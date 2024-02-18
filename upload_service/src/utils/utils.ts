import { PROCESS_ID_MAX_LENGTH } from "../configurations/mainconfig";
import fs from "fs";
import path from "path";
export function generate(){
    let ans = "";
    const subset = "0123456789qwertyuiopasdfghjklzxcvbnm";
    for (let i = 0; i < PROCESS_ID_MAX_LENGTH; i++) {
        ans += subset[Math.floor(Math.random() * subset.length)];
    }
    return ans;
}



export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath :string = path.join(folderPath,file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }else{
            response.push(fullFilePath);
        }
    });
    return response;
}