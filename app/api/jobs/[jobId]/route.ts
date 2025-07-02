import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const PATCH = async (req: Request, {params}: {params:{jobId :string}}) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedValues = await req.json();

    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }

    const job = await db.job.update({
      where :{
        id: jobId,
        userId: userId,
      },
      data : {...updatedValues}
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
