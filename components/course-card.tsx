import { Categories } from "@/app/(dashboard)/(routes)/search/_components/Categories";
import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface CourseCardProps {
    id: string;
    title: string;
    imageurl: string ;
    chaptersLenght: number;
    price: number ;
    progress: number | null;
    catagory: string | undefined;
  }


export const CourseCard = ({
    id,
    title,
    imageurl,
    chaptersLenght,
    price,
    progress,
    catagory,
}:CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageurl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {catagory}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen}/>
                            <span>
                                {chaptersLenght} {chaptersLenght >= 1 ? "Chapter":"Chapters"}
                            </span>

                        </div>
                    </div>

                    <p className="text-md md:text-sm font-medium text-slate-700">
                        {price == null ? "Free" : formatPrice(price)}
                    </p>
                </div>

            </div>
        </Link>
    );
}

