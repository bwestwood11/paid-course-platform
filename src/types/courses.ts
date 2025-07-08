import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

export type GetCourseById = inferRouterOutputs<AppRouter>["courses"]["getCourseById"]