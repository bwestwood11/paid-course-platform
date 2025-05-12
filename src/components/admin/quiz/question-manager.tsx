"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QuestionForm } from "./question-form"
import type { Question, Quiz } from "@/lib/quiz/type"
import { QuestionList } from "./question-list"

interface QuestionManagerProps {
  quiz: Quiz
  onQuizUpdate: (quiz: Quiz) => void
  onComplete: () => void
}

export function QuestionManager({ quiz, onQuizUpdate, onComplete }: QuestionManagerProps) {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)

  const handleAddQuestion = (question: Question) => {
    console.log("Adding question", question)
    onQuizUpdate({
      ...quiz,
      questions: [...quiz.questions, question],
    })
  }

  const handleUpdateQuestion = (question: Question, index: number) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[index] = question
    onQuizUpdate({
      ...quiz,
      questions: updatedQuestions,
    })
    setEditingQuestionIndex(null)
  }

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions.splice(index, 1)
    onQuizUpdate({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index)
  }

  return (
    <div className="space-y-8">
      {quiz.questions.length > 0 ? (
        <QuestionList questions={quiz.questions} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No questions yet</AlertTitle>
          <AlertDescription>Add at least one question to complete your quiz.</AlertDescription>
        </Alert>
      )}

      <QuestionForm
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={
          editingQuestionIndex !== null ? (question) => handleUpdateQuestion(question, editingQuestionIndex) : undefined
        }
        editingQuestion={editingQuestionIndex !== null ? quiz.questions[editingQuestionIndex] : undefined}
        onCancelEdit={() => setEditingQuestionIndex(null)}
      />

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onComplete} disabled={quiz.questions.length === 0}>
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
