import { commandOptions, createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./routes/aws";
import { buildProject } from "./utils/buildProject";
const subscriber = createClient();
subscriber.connect();


const publisher = createClient();
publisher.connect();


async function main () {
    while (1) {
        const response = await subscriber.brPop(
            commandOptions({isolated:true}),
            'build-queue',
            0
        );
        const id = response?.element?response?.element:"";
        await downloadS3Folder(`output/${id}`,__dirname);
        await buildProject(id,__dirname);
        await copyFinalDist(id,__dirname);
        publisher.hSet("status",id,"deployed");
        console.log(typeof response);
    }
}

main();