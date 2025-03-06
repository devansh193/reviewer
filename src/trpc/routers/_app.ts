import { createTRPCRouter } from "../init";
import { s3Router } from "@/modules/s3/server/procedure";
import { resumeRouter } from "@/modules/resume/server/procedure";

export const appRouter = createTRPCRouter({
  s3: s3Router,
  resume: resumeRouter,
});

export type AppRouter = typeof appRouter;
