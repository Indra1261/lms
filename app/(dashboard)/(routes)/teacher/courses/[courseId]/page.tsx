import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/Title-form";
import { DescriptionForm } from "./_components/Description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/Price-form";
import { AttachmentForm } from "./_components/Attachment-form";
import { ChaptersForm } from "./_components/Chapter-form";



const CourseIdPage = async (
  { params }: { params: { courseId: string } }
) => {

  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId
    },
    include:{
      chapters:{
        orderBy:{
          position:"asc",
        },
      },
      attachments:{
        orderBy:{
          createdAt:"desc"
        },
      },
    },
  });

  const categories = await db.catagory.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageurl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublic)
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course setup
          </h1>
          <span className="text-sm text-slate-700 ">
            Complete all fileds {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-11 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
          <TitleForm
            initialData={course}
            courseId={course.id}
          />
          <DescriptionForm
            intialDescription={course.description}
            courseId={course.id}
          />
          <ImageForm
            initialImageUrl={course.imageurl}
            courseId={course.id}
          />
          <CategoryForm
            intialCatagoryId={course.categoryId}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        < div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">
                Course Chapters
              </h2>
            </div>

              <ChaptersForm
              initialData={course}
              courseId={course.id}
              />
          </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">
                  Sell your course
                </h2>
              </div>
              <PriceForm
                initialPrice={course.price}
                courseId={course.id}
              />
            </div>
          
          <div>
            <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">
                  Resources & Attachments
                </h2>
            </div>

            <AttachmentForm
            initialdata={course}
            courseId={course.id}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default CourseIdPage