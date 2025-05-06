"use client";

import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import UploadTrailerModal from "../modals/upload-trailer-modal";
import { api } from "@/trpc/react";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import MuxPlayer from "../mux-player";

type Trailer =
  inferRouterOutputs<AppRouter>["courses"]["getCourseContent"]["courseTrailer"];

export default function CourseTrailer({
  courseId,
  trailer,
}: {
  courseId: string;
  trailer: Trailer;
}) {
  const createMutation = api.trailer.setup.useMutation();

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {trailer?.muxPlaybackId ? (
              <MuxPlayer
                playbackId={trailer.muxPlaybackId}
                className="w-full"
                autoPlay={false}
              />
            ) : (
              <video className="h-[300px] w-full" controls>
                <source src={trailer?.videoUrl ?? undefined} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <Button
              size="sm"
              className="absolute right-4 top-4"
              variant="secondary"
              onClick={() => createMutation.mutate({ courseId: courseId })}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Add Trailer
            </Button>
          </div>
          <div className="p-6">
            <h2 className="mb-2 text-2xl font-bold">{trailer?.title}</h2>
            <p className="text-muted-foreground">{trailer?.description}</p>
          </div>
        </CardContent>
      </Card>

      <UploadTrailerModal
        endpoint={createMutation.data!}
        open={!!createMutation.data}
        onOpenChange={() => {console.log("onOpenChange");}}
      />
    </>
  );
}
