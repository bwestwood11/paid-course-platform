import ChapterEditorFetcher from "@/components/course-content/chapters/chapter-editor-fetcher";
import { api } from "@/trpc/server";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = await api.courses.getChapter({ chapterId });
  if (!chapter) {
    return <div>Chapter not found</div>;
  }
  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Edit Chapter</h1>
      
      <ChapterEditorFetcher chapterId={chapterId} initialChapter={chapter} />
    </div>
  );
}
