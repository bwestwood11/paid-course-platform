"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Define the form schema with validation
const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

type ChallengeFormProps = {
  courseId: string;
  initialValue?: z.infer<typeof formSchema> & { id: string };
  type?: "create" | "edit";
};

export default function ChallengeForm({
  courseId,
  initialValue,
  type = "create",
}: ChallengeFormProps) {
  // Initialize the form with React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValue?.title ?? "",
      description: initialValue?.description ?? "",
      url: initialValue?.url ?? "",
    },
  });
  const router = useRouter();
  const { isPending, mutate } =
    api.challenges.createChallenge.useMutation({
      onSuccess: () => {
        toast.success("Challenge created successfully!");
        form.reset();
        router.push(`/admin/courses/${courseId}/content`);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });

  const { isPending: isUpdating, mutate: editMutation } =
    api.challenges.updateChallenge.useMutation({
      onSuccess: () => {
        toast.success("Challenge updated successfully!");
        form.reset();
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });

  // Define the submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === "create") {
      mutate({
        title: values.title,
        description: values.description,
        sourceCode: values.url,
        courseId: courseId,
      });
    } else if (type === "edit" && initialValue?.id) {
      // Call the edit mutation (assuming you have an editChallenge mutation)
      editMutation({
        id: initialValue.id,
        title: values.title,
        description: values.description,
        sourceCode: values.url,
      });
    }
  }

  const isStatusPending = isPending ?? isUpdating;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <Link href={`/admin/courses/${courseId}/content`}>
        <Button variant="ghost" size="sm" className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course Content
        </Button>
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {type === "create" ? "Create Challenge" : "Edit Challenge"}
        </h1>
        <p className="text-muted-foreground">
          {type === "create"
            ? "Create a new challenge for users to complete."
            : "Edit the challenge details below."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter challenge title" {...field} />
                </FormControl>
                <FormDescription>
                  A clear and concise title for your challenge.
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
                    minLength={10}
                    rows={30}
                    placeholder="Describe the challenge in detail..."
                    className="min-h-32 resize-y p-3"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide detailed instructions and context for the challenge.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/resource"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Link to any external resource needed for the challenge.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isStatusPending}
            type="submit"
            className="w-full sm:w-auto"
          >
            {isStatusPending
              ? type === "create"
                ? "Creating..."
                : "Updating..."
              : type === "create"
                ? "Create Challenge"
                : "Update Challenge"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
