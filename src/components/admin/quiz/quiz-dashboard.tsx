

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

import Link from "next/link"
import { api } from "@/trpc/server"
import { QuizList } from "./quiz-list"

export default async function QuizDashboard({courseId}: { courseId: string }) {
const quizzes = await api.quizzes.getAllQuizzes({ courseId: courseId})

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Your Quizzes</h2>
        <Link href="quiz/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </Link>
      </div>

      {quizzes.length > 0 ? (
        <QuizList quizzes={quizzes} />
      ) : (
        <div className="text-center py-12 rounded-lg ">
          <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
          <p className="text-slate-500 mb-4">Create your first quiz to get started</p>
          <Link href="quiz/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}