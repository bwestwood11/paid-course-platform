"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Question } from "@/lib/quiz/type"
import { Pencil, Trash2 } from "lucide-react"


interface QuestionListProps {
  questions: Question[]
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Questions ({questions.length})</h3>
      <div className="space-y-3">
        {questions.map((question, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="py-3 px-4 flex flex-row items-start justify-between">
              <div className="font-medium">
                {index + 1}. {question.question}
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(index)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit question</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(index)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete question</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options.map((option) => (
                  <div
                    key={option.option}
                    className={`p-2 rounded-md ${
                      option.isCorrect 
                        ? " border border-green-300"
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
