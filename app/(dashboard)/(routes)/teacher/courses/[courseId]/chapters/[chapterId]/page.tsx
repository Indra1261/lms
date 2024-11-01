import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Book, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitileForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoUrlForm } from "./_components/chapter-video-url-form";
import { ChapterAttachmentForm } from "./_components/chapter-attachment-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-action";



const ChapterIdPage = async(
    {params

    }:{
        params:{courseId: string; chapterId:string}
    }) => {

        const {userId}=auth();
        if(!userId){
            return redirect("/");
        }

        const chapter=await db.chapter.findUnique({
            where:{
                id:params.chapterId,
                courseId:params.courseId
            },
           
            include:{
                muxData:true,
                attachments:{
                    orderBy:{
                      createdAt:"desc"
                    },
                  },
            }
            
        });

        if(!chapter){
            return redirect("/");
        }

        const requiredFields=[
            chapter.title,
            chapter.description,
            chapter.videoUrl,
        ]

        const totalFields=requiredFields.length;
        const completedFields=requiredFields.filter(Boolean).length;

        const completionText=`(${completedFields}/${totalFields})`;
        const isComplete=requiredFields.every(Boolean);
        return (
        <>  
            {!chapter.isPublic && (
                <Banner
                    variant="warning"
                    label="This chapter is unpublished.It will not be visible in the course"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link 
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75"
                        >
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                            Back to course page
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    <span className="text-sm text-slate-700">
                                        Complete all fields {completionText}
                                    </span>
                                </h1>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublic={chapter.isPublic}

                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard}/>
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitileForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye}/>
                                <h2 className="text-xl">
                                    Access Settings
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video}/>
                            <h2 className="text-xl">
                                Add a video 
                            </h2>
                        </div>
                        <ChapterVideoUrlForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Book}/>
                            <h2 className="text-xl">
                                Resources 
                            </h2>
                        </div>
                        <ChapterAttachmentForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>

                </div>
            </div>
        </>
        )
}

export default ChapterIdPage