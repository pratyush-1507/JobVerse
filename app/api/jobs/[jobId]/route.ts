import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// =================== PATCH ===================
export const PATCH = async (req: Request,{params}:{params: { jobId: string }}) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }

    const updatedValues = await req.json();

    const job = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: { ...updatedValues },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error(`[JOB_PATCH]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// =================== DELETE ===================
export const DELETE = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });
    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const deletejob = await db.job.delete({
      where: {
        id: jobId,
      },
    });

    return NextResponse.json(deletejob);
  } catch (error) {
    console.error(`[JOB_DELETE]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};