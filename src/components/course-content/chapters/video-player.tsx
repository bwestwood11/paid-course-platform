"use client";

import MuxPlayer from "@/components/mux-player";


export function VideoPlayer({ playbackId, thumbnailUrl }: { playbackId: string, thumbnailUrl?: string }) {
 
  return (
    <div className="relative aspect-video w-full">
   
      <MuxPlayer
        className="w-full"
        playbackId={playbackId}
        poster={thumbnailUrl}
        metadata={{ player_name: "with-mux-video" }}
        accentColor="rgb(34 197 94)" // Green color
      />
    </div>
  );
}
