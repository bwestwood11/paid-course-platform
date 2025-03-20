import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  systemAdminProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { getPagination } from "@/lib/utils";

export const coursesRouter = createTRPCRouter({
  getAllAdminCourses: systemAdminProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const courses = await db.course.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        include: {
          thumbnail: true,
        }
      });

      const { hasNextPage, nextCursor } = getPagination(courses, limit, "id");
      return {
        courses,
        hasNextPage,
        nextCursor,
      };
    }),
  createCourse: systemAdminProcedure
    .input(
      z.object({
        title: z.string().min(3).max(255),
        description: z.string().min(3).max(300),
        courseDifficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
        thumbnail: z.object({
          url: z.string().url(),
          id: z.string(),
          name: z.string(),
        }),
        tags: z.string().array(),
        starterCode: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        title,
        description,
        courseDifficulty,
        thumbnail,
        tags,
        starterCode,
      } = input;

      const newCourse = await db.course.create({
        data: {
          title,
          description,
          courseDifficulty,
          thumbnail: {
            create: {
              url: thumbnail.url,
              name: thumbnail.name,
              uploadThingId: thumbnail.id,
            },
          },
          tags,
          courseLength: 0,
          starterCode,
        },
      });

      await db.orphanImage.delete({
        where: {
          uploadThingId: thumbnail.id,
        },
      });
      return newCourse.id;
    }),
});
