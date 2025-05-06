"use client";

import type React from "react";


import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import TagsInput from "../ui/tags-input";
import { api } from "@/trpc/react";
import { UploadDropzone } from "../ui/uploadthing";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  thumbnail: z.object({
    url: z.string().url("Please enter a valid URL"),
    id: z.string(),
    name: z.string(),
  }),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  githubUrl: z.string().url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

export function CourseForm() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "BEGINNER",
      tags: [],
      githubUrl: "",
    },
  });
  
  const courseMutation = api.courses.createCourse.useMutation({
    onSuccess: () => {
      toast("Your new course has been created successfully.");
      router.push("/admin/courses");
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      toast("There was a problem creating your course.");
    },
  });

  async function onSubmit(data: FormValues) {
    courseMutation.mutate({
      title: data.title,
      description: data.description,
      courseDifficulty: data.difficulty,
      thumbnail: {
        url: data.thumbnail.url,
        id: data.thumbnail.id,
        name: data.thumbnail.name,
      },
      tags: data.tags,
      starterCode: data.githubUrl,
    });
  }

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-1 pl-0"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6 md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Course Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Advanced React Patterns"
                        className="py-6 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The title should be clear and descriptive.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Course Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the course content and what students will learn..."
                        className="min-h-40 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A comprehensive description helps students understand what
                      they&apos;ll learn.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Difficulty Level
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="py-6 text-base">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the appropriate difficulty level for your target
                      audience.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      GitHub Source Code URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repo"
                        className="py-6 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Link to the GitHub repository containing the course source
                      code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 md:col-span-2">
              <Separator className="my-4" />
              <h2 className="text-xl font-semibold">Additional Information</h2>
            </div>

            <div className="space-y-6 md:col-span-2">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Course Thumbnail
                    </FormLabel>
                    <FormDescription>
                      Recommended Size: 1280px x 720px
                    </FormDescription>
                    <FormControl>
                      <div className="flex flex-col gap-4">
                        {value?.url ? (
                          <div className="rounded-md overflow-hidden">
                            <Image
                              src={value.url}
                              alt="Course Thumbnail"
                              width={640}
                              height={360}
                              className="rounded-md object-contain aspect-video"
                            />
                          </div>
                        ) : (
                          <UploadDropzone
                          className="border-dashed border-foreground/30 rounded-lg hover:bg-muted hover:cursor-pointer hover:duration-100 transition-all"
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              // Do something with the response
                              const file = res[0];
                              if (!file) return;
                              onChange({
                                url: file.ufsUrl,
                                id: file.key,
                                name: file.name,
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
                        {value && (
                          <div className="mt-2 w-full max-w-xs rounded-md border p-2">
                            <p className="mb-1 text-sm text-muted-foreground">
                              Selected file:
                            </p>
                            <p className="truncate text-sm font-medium">
                              {value.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image (max 5MB). Recommended size: 1280x720px.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 md:col-span-2">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Course Tags</FormLabel>
                    <TagsInput value={field.value} onChange={field.onChange} />
                    <FormDescription>
                      Add relevant tags to help categorize your course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 pt-6 sm:flex-row">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="order-2 w-full sm:order-1 sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={courseMutation.isPending}
              className="order-1 w-full sm:order-2 sm:w-auto"
            >
              {courseMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Course
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
