import CourseContent from "@/components/course-content/course-content";
import CourseTrailer from "@/components/course-content/course-trailer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [courseContent, sectionsQuery, quizContent, challenges] =
    await Promise.all([
      api.courses.getCourseContent({ courseId }),
      api.courses.getCourseSections({ courseId }),
      api.quizzes.getAllQuizzes({ courseId }),
      api.challenges.getChallenges({ courseId }),
    ]);
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
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Quizzes</h2>
            <Button asChild>
              <Link className="flex items-center" href="./quiz">
                {quizContent.length > 0 ? "Manage Quizzes" : "Create Quiz"}
              </Link>
            </Button>
          </div>

          {quizContent.length === 0 ? (
            <p>No quizzes created yet for this course.</p>
          ) : (
            quizContent.map((quiz) => (
              <div
                className="rounded-md border border-border p-4 hover:bg-muted"
                key={quiz.id}
              >
                <Link
                  href={`./quiz/${quiz.id}`}
                  className="flex flex-row items-center justify-between"
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
        </Card>
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Challenges</h2>
            <Button asChild>
              <Link className="flex items-center" href="./challenge/new">
                Create a Challenge
              </Link>
            </Button>
          </div>

          {!challenges.length ? (
            <p>No challenges created yet for this course.</p>
          ) : (
            challenges.map((challenge) => (
              <div
                className="rounded-md border border-border p-4 hover:bg-muted"
                key={challenge.id}
              >
                <Link
                  href={`./challenge/${challenge.id}`}
                  className="flex flex-row items-center justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{challenge.title}</h3>
                    <p className="text-foreground/50">
                      {challenge.description.length > 100
                        ? `${challenge.description.slice(0, 100)}...`
                        : challenge.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContentPage;
