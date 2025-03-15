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
      });

      const { hasNextPage, nextCursor } = getPagination(
        courses,
        limit,
        "id",
      );
      return {
        courses,
        hasNextPage,
        nextCursor,
      };
    }),
});
