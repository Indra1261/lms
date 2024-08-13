import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId:string} }
) {
    try {
        const { userId } = auth();
        const { isPublic,videoUrl,...values } = await req.json();

        const videoUrlValue = videoUrl === "" ? null : videoUrl;
        
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter=await db.chapter.update({
            where:{
                id: params.chapterId,
                courseId:params.courseId,
            },
            data:{
                videoUrl:videoUrlValue,
                ...values,
            }

        });



        return new NextResponse("Success",{status:200});

    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("Internal Error", { status: 500 });

    }

}

