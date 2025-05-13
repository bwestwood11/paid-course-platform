import ChallengeForm from "@/components/admin/challenge/challenge-form";


export default async function ChallengePage({ params }: { params: Promise<{ courseId: string }> }) {
   const { courseId } = await params
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ChallengeForm courseId={courseId} />
    </main>
  )
}