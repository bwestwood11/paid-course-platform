
import { z } from "zod";

export type QuizDetails = {
    title: string;
    description: string;
}

export const createQuestionSchema = z.object({
    question: z.string(),
    options: z.array(
        z.object({
            option: z.string(),
            isCorrect: z.boolean(),
        }),
    ).refine(
        (options) => {console.log(options); return new Set(options.map((o) => o.option)).size === options.length},
        { message: "All options must be unique" }
        
    ),
})

export const createQuizSchema = z.object({
    title: z.string(),
    description: z.string(),
    courseId: z.string(),
    questions: z.array(
      createQuestionSchema
    ),
})

export type Quiz = z.infer<typeof createQuizSchema>

export type Question = Quiz["questions"][number]