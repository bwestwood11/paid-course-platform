import QuizDashboard from "@/components/admin/quiz/quiz-dashboard";

type Props = {
    params: Promise<{
      courseId: string;
    }>;
  };

export default async function Quiz({ params }: Props) {
    const { courseId } = await params;
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Quiz Management</h1>
      <QuizDashboard  courseId={courseId}/>
    </main>
  )
}
