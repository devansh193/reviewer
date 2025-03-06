import { db } from "@/db";
import { resumes, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const resumeRouter = createTRPCRouter({
  getResume: protectedProcedure
    .input(
      z.object({
        resumeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { resumeId } = input;
      const { id: userId } = ctx?.user;

      const [resume] = await db
        .select()
        .from(resumes)
        .innerJoin(users, eq(users.id, resumes.userId))
        .where(and(eq(users.id, userId), eq(resumes.id, resumeId)));

      return resume;
    }),
});
