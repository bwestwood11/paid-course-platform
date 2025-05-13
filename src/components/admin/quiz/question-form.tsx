"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Quiz } from "@/lib/quiz/type";
import { createQuestionSchema } from "@/lib/quiz/type";
type Question = Quiz["questions"][number];



interface QuestionFormProps {
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion?: (question: Question) => void;
  editingQuestion?: Question;
  onCancelEdit?: () => void;
}

export function QuestionForm({
  onAddQuestion,
  onUpdateQuestion,
  editingQuestion,
  onCancelEdit,
}: QuestionFormProps) {
  const isEditing = !!editingQuestion;

  const form = useForm<Question>({
    resolver: zodResolver(createQuestionSchema),
    mode: "onSubmit",
    defaultValues: {
      question: "",
      options: [
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: true,
        },
      ],
    },
  });

  useEffect(() => {
    if (editingQuestion) {
      form.reset({
        question: editingQuestion.question,
        options: editingQuestion.options,
      });
    }
  }, [editingQuestion, form]);
  console.log(form.formState.errors);
  const onSubmit = (data: Question) => {
    console.log("Submitting question", data);
    const question: Question = {
      question: data.question,
      options: data.options,
    };

    if (isEditing && onUpdateQuestion) {
      onUpdateQuestion(question);
    } else {
      onAddQuestion(question);
    }
    form.reset({
      question: "",
      options: [
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: true,
        },
      ],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Question" : "Add a New Question"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Options (select the correct answer)</Label>

              <FormField
              control={form.control}
              name="options"
              render={() => (
                <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                  onValueChange={(value) => {
                    form.setValue(
                    "options",
                    form.getValues("options").map((option, index) => {
                      if (index + 1 === Number(value)) {
                      return { ...option, isCorrect: true };
                      }
                      return { ...option, isCorrect: false };
                    }),
                    );
                  }}
                  value={(
                    form.getValues("options").findIndex(
                    (option) => option.isCorrect,
                    ) + 1
                  ).toString()}
                  className="space-y-3"
                  >
                  {[1, 2, 3, 4].map((optionId, index) => (
                    <div
                    key={optionId}
                    className="flex items-start space-x-2"
                    >
                    <RadioGroupItem
                      value={optionId.toString()}
                      id={`option-${optionId}`}
                    />

                    <div className="flex-1">
                      <FormField
                      control={form.control}
                      name={`options.${index}.option`}
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                        <FormControl>
                          <Input
                          placeholder={`Option ${optionId}`}
                          {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                      )}
                      />
                    </div>
                    </div>
                  ))}
                  </RadioGroup>
                </FormControl>
                {form.formState.errors.options && (
                  <p className="text-sm text-red-500">
                  {form.formState.errors.options?.root?.message}
                  </p>
                )}
                <FormMessage />
                </FormItem>
              )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            {isEditing && onCancelEdit && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
            <Button type="submit" className={isEditing ? "flex-1" : "w-full"}>
              {isEditing ? "Update Question" : "Add Question"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
