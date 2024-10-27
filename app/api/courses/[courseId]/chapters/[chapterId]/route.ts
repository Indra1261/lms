import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    { params }: { params: { courseId: string; chapterId:string} }
){
    try {
        const {userId}=auth();
        if(!userId)
        {
            return new NextResponse("Unauthorized",{status:401});
        }

        const ownCourse =await db.course.findUnique({
            where:{
                id:params.courseId,
                userId,
            }
        });

        if(!ownCourse){
            return new NextResponse("Unauthorized",{status:401});
        }

        const chapter=await db.chapter.findUnique({
            where:{
                id:params.chapterId,
                courseId:params.courseId,
            }
        });

        if(!chapter)
        {
            return new NextResponse("Not Found",{status:401});
        }

        const deletedChapter = await db.chapter.delete({
            where:{
                id:params.chapterId
            }
        });

        const publishedChapterInCourse=await db.chapter.findMany({
            where:{
                courseId : params.courseId,
                isPublic:true
            }
        });
        
        if(!publishedChapterInCourse.length){
            await db.course.update({
                where:{
                   id:params.courseId,
                },
                data:{
                    isPublished:false,
                }
            });
        }

        return NextResponse.json(deletedChapter);

    } catch(error){
        console.log("[CHAPTER_ID_DELETED]",error);
        return new NextResponse("Internal Error",{status:500});
        
    }

}

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

