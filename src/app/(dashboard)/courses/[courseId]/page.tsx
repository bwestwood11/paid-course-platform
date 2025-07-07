import { CourseContent } from "@/components/client-facing-course-content/course-content";
import { CourseDetails } from "@/components/client-facing-course-content/course-details";
import { CourseHeader } from "@/components/client-facing-course-content/course-header";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  console.log("Course ID:", courseId);
  return (
    <div className="flex flex-1">
      <main className="flex-1 p-6">
        <CourseHeader />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CourseDetails />
          </div>
          <div className="lg:col-span-1">
            <CourseContent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
