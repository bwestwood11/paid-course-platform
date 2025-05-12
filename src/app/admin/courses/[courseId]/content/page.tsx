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
  const quizContent = await api.quizzes.getAllQuizzes({ courseId });
  if (!courseContent) return <p>Course not found</p>;
  return (
    <div className="container mx-auto max-w-5xl py-6">
      <Button variant="ghost" asChild>
        <Link
          className="mb-6 flex items-center gap-1 pl-0"
          href="/admin/courses"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>
      </Button>
      <h1 className="mb-6 text-3xl font-bold">Course Builder</h1>
      <div className="space-y-8">
        <CourseTrailer
          trailer={courseContent.courseTrailer}
          courseId={courseId}
        />
        <CourseContent courseId={courseId} sections={sectionsQuery} />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Quizzes</h2>
          {quizContent.length === 0 ? (
            <p>No quizzes available for this course.</p>
          ) : (
            quizContent.map((quiz) => (
              <div
                className="rounded-md border border-border p-4 hover:bg-muted"
                key={quiz.id}
              >
                <Link
                  href={`./quiz/${quiz.id}`}
                  className="flex flex-row justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{quiz.title}</h3>
                    <p className="text-foreground/50">{quiz.description}</p>
                  </div>
                   
                  <p>{quiz.questions.length} questions</p>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
