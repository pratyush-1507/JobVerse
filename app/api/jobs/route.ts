import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const job = await db.job.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_POST]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
