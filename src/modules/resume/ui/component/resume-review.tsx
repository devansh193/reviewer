"use client";

import { trpc } from "@/trpc/client";

interface ResumeReviewProps {
  resumeId: string;
}
export const ResumeReview = ({ resumeId }: ResumeReviewProps) => {
  const [resume] = trpc.resume.getResume.useSuspenseQuery({ resumeId });

  return (
    <div>
      <h1>{JSON.stringify(resume)}</h1>
    </div>
  );
};
