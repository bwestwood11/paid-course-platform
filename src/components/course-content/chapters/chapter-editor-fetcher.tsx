"use client";

import { api } from "@/trpc/react";
import { ChapterEditor } from "./chapter-editor";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

type Chapter = inferRouterOutputs<AppRouter>["courses"]["getChapter"];
const ChapterEditorFetcher = ({
  chapterId,
  initialChapter,
}: {
  chapterId: string;
  initialChapter: Chapter;
}) => {
  const chapterQuery = api.courses.getChapter.useQuery(
    { chapterId: chapterId },
    {
      initialData: initialChapter,
      refetchInterval(query) {
        const status = query.state.data?.muxStatus;
        console.log("status", status);
        if (status === "preparing" || status === "waiting") {
          return 1000;
        }
        return false;
      },
    },
  );
  if (chapterQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (chapterQuery.isError) {
    return <div>Error: {chapterQuery.error.message}</div>;
  }
  if (!chapterQuery.data) {
    return <div>Chapter not found</div>;
  }
  const chapter = chapterQuery.data;
  return <ChapterEditor chapter={chapter} />;
};

export default ChapterEditorFetcher;
