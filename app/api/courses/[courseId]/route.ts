import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const values = await req.json();

    const course = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
