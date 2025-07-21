"use client";

import { api } from "@/trpc/react";
import React from "react";
import MuxPlayer from "../mux-player";

const ChapterVideo = ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  const { isLoading, data, error } = api.courses.getChapter.useQuery({
    chapterId,
  });

  const { mutate } = api.courses.updateProgress.useMutation({});
  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-destructive">Failed to load chapter video.</div>
    );
  if (!data)
    return <div className="p-6 text-destructive">Chapter not found.</div>;
  return (
    <div>
      <MuxPlayer
        playbackId={data.muxPlaybackId ?? ""}
        className="w-full"
        autoPlay={false}
        poster={data.thumbnail ?? ""}
        onEnded={() => mutate({ id: courseId, chapterWatched: [chapterId] })}
      />
    </div>
  );
};

export default ChapterVideo;
