import { CourseContent } from "@/components/client-facing-course-content/course-content";
import { CourseDetails } from "@/components/client-facing-course-content/course-details";
import { CourseHeader } from "@/components/client-facing-course-content/course-header";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import type { GetCourseById } from "@/types/courses";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const session = await auth();
  const { courseId, chapterId } = await params;
  if (!courseId)
    return <div className="p-6 text-destructive">Invalid course ID.</div>;
  if (!session?.user.datePaid) return <p>Don&apos;t Fuck with us</p>;

  let course: GetCourseById;

  try {
    course = await api.courses.getCourseById({ courseId });
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return (
      <div className="p-6 text-destructive">
        Something went wrong while loading the course. Please try again later.
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-destructive">
        Course not found or may have been removed.
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <main className="flex-1 p-6">
        <CourseHeader course={course} />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CourseDetails course={course} chapterId={chapterId} />
          </div>
          <div className="lg:col-span-1">
            <CourseContent activeChapterId={chapterId} courseId={courseId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
