import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{courseId:string; chapterId:string}}
) {

    try {
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }

        const ownCourse=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        });

        if(!ownCourse)
        {
            return new NextResponse("Unauthorized",{status:401});
        }

        const chapter= await db.chapter.findUnique({
            where:{
                id:params.chapterId,
                courseId:params.courseId,
            }
        });

        if(!chapter || !chapter.title )
        {
            return new NextResponse("Missing required fields",{status:404})
        }

        const publishChapter=await db.chapter.update({
            where:{
                id: params.chapterId,
                courseId:params.courseId,
            },
            data:{
                isPublic:true,
            }
        });
        
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]",error);
        return new NextResponse("Internal Error",{status:500});
        
    }
    
}