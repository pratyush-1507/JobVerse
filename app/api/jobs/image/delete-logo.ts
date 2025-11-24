import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: Request) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
