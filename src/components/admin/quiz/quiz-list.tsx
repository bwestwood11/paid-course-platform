"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import { Loader2Icon, Trash2Icon } from "lucide-react";

type Quiz = inferRouterOutputs<AppRouter>["quizzes"]["getAllQuizzes"][number];

interface QuizListProps {
  quizzes: Quiz[];
}

export function QuizList({ quizzes }: QuizListProps) {
  const { mutate, isPending } = api.quizzes.deleteQuiz.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      console.error("Error deleting quiz", error);
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {quizzes.map((quiz, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-between">
            <p className="text-sm text-slate-500">
              {quiz.questions.length} questions
            </p>
            <button
              disabled={isPending}
              onClick={() => mutate({ quizId: quiz.id })}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin text-red-500 hover:text-red-500/60" />
              ) : (
                <Trash2Icon className="size-4 text-red-500 hover:text-red-500/60" />
              )}
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
