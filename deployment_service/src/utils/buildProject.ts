import {exec} from "child_process";
export function buildProject(id:string,dir:string){
    return new Promise((resolve)=>{
        const child = exec(`cd ${dir}/output/${id} && npm install && npm run build`);
        child.stdout?.on('data',function(data){
            console.log('stdout: '+data);
        });
        child.stderr?.on('data',function(data){
            console.log("stderr: "+data);
        });
        child.on("close",  function(code){
            console.log("code: "+code);
            resolve("");
        });
    })
}