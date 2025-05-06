"use client";

import React from "react";
import { Label } from "../ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { VideoUploader } from "../ui/video-uploader";
import { useRouter } from "next/navigation";

type UploadTrailerModalProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  endpoint: string;
};

const UploadTrailerModal = ({
  open,
  endpoint,
  onOpenChange,
}: UploadTrailerModalProps) => {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Course Trailer</DialogTitle>
          <DialogDescription>
            Upload a video trailer for your course. We use Mux for video
            processing and streaming.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Video Trailer</Label>
            <VideoUploader
              endpoint={endpoint}
              onSuccess={() => {
                router.push("./trailer");
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTrailerModal;
