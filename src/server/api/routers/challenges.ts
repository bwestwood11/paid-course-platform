import { z } from "zod";
import { createTRPCRouter, systemAdminProcedure } from "../trpc";
import { db } from "@/server/db";

const createChallengeSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    sourceCode: z.string().min(1).max(500),
    courseId: z.string().min(1).max(100),
});

const updateChallengeSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(500).optional(),
    sourceCode: z.string().min(1).max(500).optional(),
});

export const challengesRouter = createTRPCRouter({
    // Create
    createChallenge: systemAdminProcedure.input(
        createChallengeSchema
    ).mutation(async ({ input }) => {
        const { title, description, sourceCode, courseId } = input;
        const challenge = await db.challenge.create({
            data: {
                title,
                description,
                sourceCode,
                courseId,
            },
        });
        return challenge;
    }),

    // Read (Get all challenges by courseId)
    getChallenges: systemAdminProcedure.input(
        z.object({ courseId: z.string().min(1) })
    ).query(async ({ input }) => {
        const { courseId } = input;
        const challenges = await db.challenge.findMany({
            where: { courseId },
        });
        return challenges;
    }),

    // Read (Get a single challenge by ID)
    getChallengeById: systemAdminProcedure.input(
        z.object({ id: z.string().min(1) })
    ).query(async ({ input }) => {
        const { id } = input;
        const challenge = await db.challenge.findUnique({
            where: { id },
        });
        if (!challenge) {
            throw new Error("Challenge not found");
        }
        return challenge;
    }),

    // Update
    updateChallenge: systemAdminProcedure.input(
        updateChallengeSchema
    ).mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updatedChallenge = await db.challenge.update({
            where: { id },
            data,
        });
        return updatedChallenge;
    }),

    // Delete
    deleteChallenge: systemAdminProcedure.input(
        z.object({ id: z.string().min(1) })
    ).mutation(async ({ input }) => {
        const { id } = input;
        await db.challenge.delete({
            where: { id },
        });
        return { success: true };
    }),
});