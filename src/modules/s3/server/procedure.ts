import { z } from "zod";
import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { resumes } from "@/db/schema";
import { s3Driver } from "@/s3/config";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const s3Router = createTRPCRouter({
  getPreSignedUrl: protectedProcedure
    .input(
      z.object({
        mimeType: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx?.user.id;
        console.log("Generating pre-signed URL...");
        const { fileName, mimeType } = input;
        const id = uuidv4();
        const s3Key = `${id}${fileName}`;

        const [s3UploadData, resume] = await Promise.all([
          s3Driver.getUrlToUpload({ key: s3Key, mimeType }),
          db
            .insert(resumes)
            .values({
              userId,
              s3key: s3Key,
              review: {},
            })
            .returning({ id: resumes.id }),
        ]);

        console.log(s3UploadData.url, s3UploadData.path);
        return {
          preSignedUrl: s3UploadData.url,
          path: s3UploadData.path,
          resumeId: resume[0].id,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error creating a presigned URL ${error}`,
        });
      }
    }),
});
