import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { list } = await req.json();

    const courseOwner = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    })

    if(!courseOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    for(let item of list) {
        await db.chapter.update({
            where: {
                id: item.id
            },
            data: {
                position: item.position
            }
        })
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
