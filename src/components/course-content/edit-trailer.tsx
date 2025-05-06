"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type Trailer } from "@prisma/client";
import Image from "next/image";
import { api } from "@/trpc/react";
import { UploadDropzone } from "../ui/uploadthing";
import { toast } from "sonner";
import TrailerProcessingPage from "../trailer-loading";
import MuxPlayer from "../mux-player";

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.object({
    url: z.string().optional().nullable(),
    id: z.string().optional().nullable(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function VideoEditorPage({ trailer }: { trailer: Trailer }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: trailer.title,
      description: trailer.description,
      thumbnail: {
        url: trailer.thumbnail,
        id: trailer.uploadThingId,
      },
    },
  });

  // Watch form values for real-time preview
  const watchedTitle = form.watch("title");
  const watchedDescription = form.watch("description");
  const watchedThumbnail = form.watch("thumbnail");
  const editMutation = api.trailer.editTrailer.useMutation({
    onError: (error) => {
      console.error("Error editing trailer:", error);
    },
  });
  // Handle form submission
  function onSubmit(values: FormValues) {
    console.log(values);
    editMutation.mutate({
      trailerId: trailer.id,
      title: values.title,
      description: values.description ?? "",
      thumbnail: values.thumbnail,
    });
  }

  if (!trailer.muxPlaybackId) return <TrailerProcessingPage />;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Edit Video</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Form Section */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                          <Textarea rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field: { value, onChange } }) => (
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
                                    src={trailer.previewUrl ?? value.url}
                                    alt="Course Thumbnail"
                                    width={640}
                                    height={360}
                                    className="absolute inset-0 aspect-video rounded-md object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                  />
                                </div>
                                <Button
                                  onClick={() => onChange(null)}
                                  variant="destructive"
                                  className="mt-2"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Remove Thumbnail
                                </Button>
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
                                  toast(
                                    "There was an error uploading the file.",
                                  );
                                }}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold">Video Preview</h2>

              <div className="space-y-4">
                <div suppressHydrationWarning className="pt-2">
                  <MuxPlayer
                    className="w-full"
                    playbackId={trailer.muxPlaybackId}
                    poster={
                      watchedThumbnail?.url ?? trailer.thumbnail ?? undefined
                    }
                    metadata={{ player_name: "with-mux-video" }}
                    accentColor="rgb(34 197 94)" // Green color
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {watchedTitle ?? "Untitled Video"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {watchedDescription ?? "No description provided."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
