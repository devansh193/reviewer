import { createTRPCRouter } from "../init";
import { s3Router } from "@/modules/s3/server/procedure";

export const appRouter = createTRPCRouter({
  s3: s3Router,
});

export type AppRouter = typeof appRouter;
