import { Catagory, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  catagory: Catagory | null;  // Use consistent spelling
  chapters: { id: string }[];
  progress: number | null;
};

type GetCoursesParams = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCoursesParams): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive", // Case-insensitive search
          },
        }),
        ...(categoryId && { categoryId }),
      },
      include: {
        catagory: true, // Use correct spelling
        chapters: {
          where: { isPublic: true },
          select: { id: true },
        },
        purchases: {
          where: { userId },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Use Promise.all to fetch progress for each course
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        const progress =
          course.purchases.length === 0
            ? null
            : await getProgress(userId, course.id);

        return {
          ...course,
          progress,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES_ERROR]", error);
    return [];
  }
};
