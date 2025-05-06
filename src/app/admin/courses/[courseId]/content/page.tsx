import CourseContent from "@/components/course-content/course-content";
import CourseTrailer from "@/components/course-content/course-trailer";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{
    courseId: string;
  }>;
};

const ContentPage = async ({ params }: Props) => {
  const { courseId } = await params;
  const courseContent = await api.courses.getCourseContent({ courseId });
   const sectionsQuery = await api.courses.getCourseSections({ courseId });
  if (!courseContent) return <p>Course not found</p>;
  return (
    <div className="container mx-auto max-w-5xl py-6">
       <Button
          variant="ghost"
          
          asChild
        >
          <Link className="mb-6 flex items-center gap-1 pl-0" href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>
        </Button>
      <h1 className="mb-6 text-3xl font-bold">Course Builder</h1>
      <div className="space-y-8">
        <CourseTrailer trailer={courseContent.courseTrailer} courseId={courseId} />
        <CourseContent courseId={courseId} sections={sectionsQuery} />
      </div>
    </div>
  );
};

export default ContentPage;
