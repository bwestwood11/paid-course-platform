import { VideoPlayer } from "./video-player"


// In a real app, this would be fetched from your API
async function getChapter(chapterId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // This is mock data - in a real app, you would fetch from your database
  return {
    id: chapterId,
    title: "Introduction to React",
    description:
      "Learn the basics of React and how to create your first component. This chapter covers the fundamental concepts of React, including components, props, and state. By the end of this chapter, you'll understand how React works and be able to build simple interactive UIs.\n\nWe'll also explore the React ecosystem and how it fits into modern web development. React has revolutionized how developers build user interfaces, and understanding its core principles will help you become a better frontend developer.",
    videoUrl: "https://example.com/videos/react-intro.mp4",
    courseTitle: "Complete React Developer Course",
    chapterNumber: 1,
  }
}

export async function ChapterContent({ chapterId }: { chapterId: string }) {
  const chapter = await getChapter(chapterId)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{chapter.courseTitle}</span>
          <span className="mx-2">•</span>
          <span>Chapter {chapter.chapterNumber}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{chapter.title}</h1>
      </div>

      {chapter.videoUrl ? (
        <div className="aspect-video overflow-hidden rounded-lg border bg-black shadow-sm">
          <VideoPlayer playbackId={chapter.videoUrl} />
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center rounded-lg border bg-muted">
          <p className="text-muted-foreground">No video available for this chapter</p>
        </div>
      )}

      <div className="prose max-w-none dark:prose-invert">
        {chapter.description.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          Previous Chapter
        </button>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Next Chapter
        </button>
      </div>
    </div>
  )
}
