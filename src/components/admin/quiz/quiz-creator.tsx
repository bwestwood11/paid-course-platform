"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, FileEdit, ListChecks} from "lucide-react"
import type { QuizDetails, Quiz } from "@/lib/quiz/type"
import { QuizDetailsForm } from "./quiz-details-form"
import { QuestionManager } from "./question-manager"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export function QuizCreator({courseId}: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<"details" | "questions" | "review">("details")
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null)
  const [quiz, setQuiz] = useState<Quiz>({
    courseId: courseId,
    title: "",
    description: "",
    questions: [],
  })
 const router = useRouter()
  const handleDetailsSubmit = (details: QuizDetails) => {
    setQuizDetails(details)
    setQuiz((prev) => ({
      ...prev,
      title: details.title,
      description: details.description,
    }))
    setActiveTab("questions")
  }
  const { mutate} = api.quizzes.createQuiz.useMutation({
    onSuccess: () => {
      router.push(`/admin/courses/${courseId}/quiz`)
    },
    onError: (error) => {
      console.error("Error creating quiz", error)
    },
  })
  const handleQuizComplete = () => {
         if (quiz.questions.length === 0) {
           return toast.error("Please add at least one question to the quiz.")
         }
          if (!quizDetails) {
            return toast.error("Please fill in the quiz details.")
          }
    mutate({
      courseId: quiz.courseId,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
    })

  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border shadow-sm">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "details" | "questions" | "review")} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" disabled={activeTab === "questions" && !quizDetails}>
              <FileEdit className="h-4 w-4 mr-2" />
              Quiz Details
            </TabsTrigger>
            <TabsTrigger value="questions" disabled={!quizDetails}>
              <ListChecks className="h-4 w-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="review" disabled={!quizDetails || quiz.questions.length === 0}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Review
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="details">
              <QuizDetailsForm onSubmit={handleDetailsSubmit} initialValues={quizDetails ?? undefined} />
            </TabsContent>

            <TabsContent value="questions">
              {quizDetails && (
                <div className="space-y-6">
                  <div className=" p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-1">{quiz.title}</h2>
                    <p className="">{quiz.description}</p>
                  </div>

                  <QuestionManager quiz={quiz} onQuizUpdate={setQuiz} onComplete={() => setActiveTab("review")} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="review">
              <div className="space-y-6">
                <div className=" p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-2">{quiz.title}</h2>
                  <p className="">{quiz.description}</p>

                  <h3 className="text-lg font-medium mb-4">Questions ({quiz.questions.length})</h3>
                  <div className="space-y-4">
                    {quiz.questions.map((question, index) => (
                      <Card key={index} className="p-4">
                        <p className="font-medium mb-3">
                          {index + 1}. {question.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option) => (
                            <div
                              key={option.option}
                              className={`p-2 rounded-md ${
                                option.isCorrect
                                  ? "border-green-300"
                                  : ""
                              }`}
                            >
                              {option.option}
                              {option.isCorrect && (
                                <span className="ml-2 text-green-600 text-sm">(Correct)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("questions")}>
                    Back to Questions
                  </Button>
                  <Button onClick={handleQuizComplete}>Complete Quiz</Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
