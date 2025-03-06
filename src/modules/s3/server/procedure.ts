import { getFileExtension } from "@/lib/utils";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { s3Driver } from "@/s3/config";
import { TRPCError } from "@trpc/server";

export const s3Router = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  getPreSignedUrl: protectedProcedure
    .input(
      z.object({
        mimeType: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log("I am inside routers try.");
        const { fileName, mimeType } = input;
        const extension = getFileExtension(fileName);
        const id = uuidv4();
        const attachmentkey = `${id}${
          extension ? `.${extension}` : ""
        }${fileName}`;

        const { url, path } = await s3Driver.getUrlToUpload({
          key: attachmentkey,
          mimeType,
        });
        console.log(url, path);
        return {
          preSignedUrl: url,
          path,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error creating a presigned URL ${error}`,
        });
      }
    }),
});
