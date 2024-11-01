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

        const publishChapter=await db.chapter.update({
            where:{
                id: params.chapterId,
                courseId:params.courseId,
            },
            data:{
                isPublic:false,
            }
        });

        const publishedChaptersInCourse=await db.chapter.findMany({
            where:{
                courseId:params.courseId,
                isPublic:true,
            },
        });

        if(!publishedChaptersInCourse.length)
        {
            await db.course.update({
                where:{
                    id:params.courseId,
                },
                data:{
                    isPublished:false,
                }
            });
        }
        
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]",error);
        return new NextResponse("Internal Error",{status:500});
        
    }
    
}