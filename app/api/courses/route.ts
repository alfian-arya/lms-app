import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const course = await db.course.create({
      data: {
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
}
