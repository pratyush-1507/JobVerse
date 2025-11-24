import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCh = async(
    req: Request,
    {params} : {params: {jobId: string}}
)=>{
    try{
        const {userId} = await auth();
        const {jobId} = params;
        if(!userId){
            return new Response("Unauthorized", {status: 401});
        }
        if(!jobId){
            return new Response("Job Id is missing", {status: 400});
        }
        const job = await db.job.findUnique({
            where:{
                id: jobId,
                userId
            }
        });
        if(!job){
            return new Response("Job not found", {status: 404});
        }

        const publishJob = await db.job.update({
            where:{
                id: jobId
            },
            data:{
                isPublished: true
            }
        });
        return NextResponse.json(publishJob);
       

    }catch(error){
        console.log("Error publishing job:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}
