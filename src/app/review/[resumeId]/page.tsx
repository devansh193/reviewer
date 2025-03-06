import { ResumeReview } from "@/modules/resume/ui/component/resume-review";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
export const dynamic = "force-dynamic";
interface PageProps {
  params: Promise<{ resumeId: string }>;
}
const Page = async ({ params }: PageProps) => {
  const { resumeId } = await params;
  void trpc.resume.getResume.prefetch({ resumeId });
  return (
    <HydrateClient>
      <ResumeReview resumeId={resumeId} />
    </HydrateClient>
  );
};

export default Page;
