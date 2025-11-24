import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const PATCH = async (
  req: Request,
  { params }: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedValues = await req.json();

    if (!companyId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }

    const company = await db.company.update({
      where: {
        id: companyId,
        userId,
      },
      data: { ...updatedValues },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
