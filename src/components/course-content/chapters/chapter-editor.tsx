"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { VideoPlayer } from "./video-player";
import { api } from "@/trpc/react";
import { VideoUploader } from "@/components/ui/video-uploader";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import { UploadDropzone } from "@/components/ui/uploadthing";
import Image from "next/image";
import { RefreshCcw, X } from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  thumbnail: z.object({
    url: z.string().optional().nullable(),
    id: z.string().optional().nullable(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Chapter = inferRouterOutputs<AppRouter>["courses"]["getChapter"];
export function ChapterEditor({ chapter }: { chapter: Chapter }) {
  // Initialize the form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: chapter?.title ?? "",
      description: chapter?.description ?? "",
      thumbnail: {
        url: chapter?.thumbnail ?? undefined,
        id: chapter?.uploadThingId ?? undefined,
      },
    },
    mode: "onChange",
  });

  const updateMutation = api.courses.updateChapter.useMutation({
    onSuccess: () => {
      toast("Chapter updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update chapter:", error);
      toast("Failed to update chapter");
    },
  });

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    if (!chapter?.id) return;
    updateMutation.mutate({
      chapterId: chapter?.id,
      title: values.title,
      description: values.description,
      thumbnail: values.thumbnail,
    });
  };
  const utils = api.useUtils();
  const setupVideoMutation = api.courses.setupChapterVideo.useMutation({
    onSuccess: () => {
      toast("Video uploaded successfully");
    },
    onError: (error) => {
      console.error("Failed to upload video:", error);
      toast("Failed to upload video");
    },
  });

  if (!chapter) return null;

  return (
    <div className="flex gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter chapter title" {...field} />
                </FormControl>
                <FormDescription>
                  The title of your chapter. Keep it concise and descriptive.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter chapter description"
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormDescription>
                  Describe what students will learn in this chapter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field: { value, onChange, } }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    {value?.url ? (
                      <div className="overflow-hidden rounded-md">
                        <div className="group relative aspect-video w-full">
                          <Image
                            src={value.url}
                            alt="Course Thumbnail"
                            width={640}
                            height={360}
                            className="absolute inset-0 aspect-video rounded-md object-contain transition-opacity duration-300 group-hover:opacity-0"
                          />
                          <Image
                            src={chapter.previewUrl ?? value.url}
                            alt="Course Thumbnail"
                            width={640}
                            height={360}
                            className="absolute inset-0 aspect-video rounded-md object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => onChange(null)}
                            variant="destructive"
                            className="mt-2"
                            type="button"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove Thumbnail
                          </Button>
                          <Button
                            onClick={() =>
                              form.setValue("thumbnail", {
                                url: chapter.thumbnail,
                                id: chapter.uploadThingId,
                              })
                            }
                            variant="outline"
                            className="mt-2"
                            type="button"
                          >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refresh
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <UploadDropzone
                        className="rounded-lg border-dashed border-foreground/30 transition-all hover:cursor-pointer hover:bg-muted hover:duration-100"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          const file = res[0];
                          if (!file) return;
                          onChange({
                            url: file.ufsUrl,
                            id: file.key,
                          });

                          console.log("Files: ", res);
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                          toast("There was an error uploading the file.");
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={!form.formState.isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        <Dialog
          open={!!setupVideoMutation.data}
          onOpenChange={() => setupVideoMutation.reset()}
        >
          <DialogContent className="mx-auto my-20 rounded-lg p-6 shadow-lg sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="mb-4 text-center text-xl font-semibold">
                Upload Video
              </DialogTitle>
              <DialogDescription className="mb-6 text-center text-muted-foreground">
                Please upload a video for this chapter. Ensure the video is
                relevant and adheres to the platform&apos;s guidelines.
              </DialogDescription>
            </DialogHeader>
            <VideoUploader
              onSuccess={async () => {
                setupVideoMutation.reset();
               await utils.courses.getChapter.invalidate({
                  chapterId: chapter.id,
                });

                toast("Video uploaded successfully");
              }}
              endpoint={setupVideoMutation.data}
            />
          </DialogContent>
        </Dialog>
      </Form>
      <div className="flex-1 space-y-4">
        <h3 className="text-lg font-medium">Chapter Video</h3>

        {chapter.muxPlaybackId ? (
          <div className="space-y-4">
            {chapter.muxStatus === "preparing" && (
              <div className="flex flex-col items-center space-y-2 py-5">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-muted"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your video is being processed. Hang tight!
                </p>
              </div>
            )}
            {chapter.muxStatus !== "preparing" && (
              <>
                <VideoPlayer
                  thumbnailUrl={chapter.thumbnail ?? undefined}
                  playbackId={chapter.muxPlaybackId}
                />

                <Button
                  onClick={() =>
                    setupVideoMutation.mutate({ chapterId: chapter.id })
                  }
                  variant="outline"
                  type="button"
                  disabled={setupVideoMutation.isPending}
                >
                  {setupVideoMutation.isPending ? "Loading..." : "Change Video"}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8">
            {chapter.muxStatus === "preparing" && (
              <div className="flex flex-col items-center space-y-2 py-5">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-muted"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your video is being processed. Hang tight!
                </p>
              </div>
            )}
            {chapter.muxStatus !== "preparing" && (
              <>
                <p className="mb-4 text-muted-foreground">
                  No video has been uploaded for this chapter
                </p>
                <Button
                  disabled={setupVideoMutation.isPending}
                  onClick={() =>
                    setupVideoMutation.mutate({ chapterId: chapter.id })
                  }
                  type="button"
                >
                  {setupVideoMutation.isPending ? "Loading" : "Upload Video"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
