import { Suspense } from "react"
import { ChapterSkeleton } from "./chapter-skeleton"
import { ChapterContent } from "./chapter-content"


export function ChapterViewer({ chapterId }: { chapterId: string }) {
  return (
    <div className="container max-w-5xl py-8">
      <Suspense fallback={<ChapterSkeleton />}>
        <ChapterContent chapterId={chapterId} />
      </Suspense>
    </div>
  )
}
