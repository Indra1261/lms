import YouTubeEmbed from "@/app/(dashboard)/_components/YoutubePlayer";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { ArrowDown, File } from "lucide-react";

const ChapterIdPage = async ({
    params,
}: { params: { courseId: string; chapterId: string } }) => {
    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
        },
        select: {
            videoUrl: true,
            title: true,
            description: true,
            attachments: true,
        },
    });

    const { videoUrl, title, description, attachments } = chapter || {};

    return (
        <>
            <div className="flex flex-col items-center  p-4">
                <div className="w-full max-w-3xl aspect-video "> {/* Reduced from mb-6 to mb-2 */}
                    <YouTubeEmbed videoUrl={videoUrl || ""} />
                </div>
            </div>
            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            </div>
            <div>
                <Separator/>
            </div>
            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                <p>{description}</p>
            </div>
            <div>
                <div className="flex ">
                    <ArrowDown height={31}/>
                    <h4 className="p-1 text-slate-600">Find attachments below
                    </h4>
                </div>


                {attachments!.length > 0 && (
                    <div className="space-y-2">
                        {attachments!.map((attachment) => (
                            <a  
                                href={attachment.url}
                                key={attachment.id}
                                className="flex items-center p-3 w-full bg-sky-100 border-sky-200
                            border text-sky-700 rounded-md hover:underline"

                            >
                                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                <p className="text-xs line-clamp-1">
                                    {attachment.name}
                                </p>
                            </a>
                        ))}
                    </div>
                )

                }

            </div>
        </>
    );
};

export default ChapterIdPage;
