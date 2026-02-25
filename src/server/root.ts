import { createTRPCRouter } from "@/server/trpc";
import { coursesRouter } from "@/server/routers/courses";

export const appRouter = createTRPCRouter({
  courses: coursesRouter,
});

export type AppRouter = typeof appRouter;
