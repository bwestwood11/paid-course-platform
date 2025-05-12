import { z } from "zod";
import { createTRPCRouter, systemAdminProcedure } from "../trpc";
import { db } from "@/server/db";

export const quizRouter = createTRPCRouter({
    getAllQuizzes: systemAdminProcedure
        .input(
            z.object({
                courseId: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const quizzes = await db.quiz.findMany({
                where: { courseId: input.courseId },
                include: {
                    questions: true,
                },
            });
            return quizzes;
        }),
    createQuiz: systemAdminProcedure
        .input(
            z.object({
                title: z.string(),
                description: z.string(),
                courseId: z.string(),
                questions: z.array(
                    z.object({
                        question: z.string(),
                        options: z.array(
                            z.object({
                                option: z.string(),
                                isCorrect: z.boolean(),
                            }),
                        ),
                    }),
                ),
            }),
        )
        .mutation(async ({ input }) => {
            const quiz = await db.quiz.create({
                data: {
                    title: input.title,
                    courseId: input.courseId,
                    description: input.description,
                    questions: {
                        create: input.questions.map((question) => {
                            return {
                                question: question.question,
                                options: {
                                    create: question.options.map((option) => {
                                        return {
                                            option: option.option,
                                            isCorrect: option.isCorrect,
                                        };
                                    }),
                                },
                            };
                        }),
                    },
                },
            });
            return quiz;
        }),

    getQuiz: systemAdminProcedure
        .input(
            z.object({
                quizId: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const quiz = await db.quiz.findUnique({
                where: { id: input.quizId },
                include: {
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            return quiz;
        }),

    addNewQuestion: systemAdminProcedure
        .input(
            z.object({
                quizId: z.string(),
                question: z.object({
                    question: z.string(),
                    options: z.array(
                        z.object({
                            option: z.string(),
                            isCorrect: z.boolean(),
                        }),
                    ),
                }),
            }),
        )
        .mutation(async ({ input }) => {
            const question = await db.question.create({
                data: {
                    quizId: input.quizId,
                    question: input.question.question,
                    options: {
                        create: input.question.options.map((option) => ({
                            option: option.option,
                            isCorrect: option.isCorrect,
                        })),
                    },
                },
            });
            return question;
        }),

    updateQuiz: systemAdminProcedure
        .input(
            z.object({
                quizId: z.string(),
                title: z.string().optional(),
                description: z.string().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const updatedQuiz = await db.quiz.update({
                where: { id: input.quizId },
                data: {
                    title: input.title,
                    description: input.description,
                },
            });
            return updatedQuiz;
        }),

    deleteQuiz: systemAdminProcedure
        .input(
            z.object({
                quizId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            await db.quiz.delete({
                where: { id: input.quizId },
            });
            return { success: true };
        }),

    deleteQuestion: systemAdminProcedure
        .input(
            z.object({
                questionId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            await db.question.delete({
                where: { id: input.questionId },
            });
            return { success: true };
        }),

    updateQuestion: systemAdminProcedure
        .input(
            z.object({
                questionId: z.string(),
                question: z.string().optional(),
                options: z
                    .array(
                        z.object({
                            option: z.string(),
                            isCorrect: z.boolean(),
                        }),
                    )
                    .optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const updatedQuestion = await db.question.update({
                where: { id: input.questionId },
                data: {
                    question: input.question,
                    options: input.options
                        ? {
                                deleteMany: {}, // Clear existing options
                                create: input.options.map((option) => ({
                                    option: option.option,
                                    isCorrect: option.isCorrect,
                                })),
                            }
                        : undefined,
                },
            });
            return updatedQuestion;
        }),
});
