import aws,{S3} from "aws-sdk";
import fs from "fs";
import { ACCESS_KEY, REGION, SECRET_ACCESS_KEY } from "../configurations/S3Config";
aws.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
});
const s3 = new S3({
    accessKeyId:ACCESS_KEY,
    secretAccessKey:SECRET_ACCESS_KEY,
});


export const uploadFile = (fileName: string, localFilePath: string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(localFilePath, (err, fileContent) => {
            if (err) {
                reject(err);
                return;
            }
            s3.upload({
                Body: fileContent,
                Bucket: "smavercel",
                Key: fileName.replace(/\\/g, '/')
            }, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    });
};
