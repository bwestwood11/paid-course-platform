
import { QuizCreator } from "@/components/admin/quiz/quiz-creator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CreateQuizPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
        </div>

        <QuizCreator courseId={courseId} />
      </div>
    </div>
  )
}