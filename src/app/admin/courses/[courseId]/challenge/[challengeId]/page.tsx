import ChallengeForm from "@/components/admin/challenge/challenge-form";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function EditChallengePage({
  params,
}: {
  params: Promise<{ courseId: string; challengeId: string }>;
}) {
  const { courseId, challengeId } = await params;
  const challenge = await api.challenges.getChallengeById({ id: challengeId });
  if (!challenge) {
    return redirect("./new");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ChallengeForm
        type="edit"
        courseId={courseId}
        initialValue={{
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          url: challenge.sourceCode,
        }}
      />
    </main>
  );
}
