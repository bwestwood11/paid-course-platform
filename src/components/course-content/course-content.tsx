"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import CourseSection from "./course-section";
import { api } from "@/trpc/react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v6 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define types for our data structure
const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  sequenceNumber: z.number(),
  courseId: z.string(),
  chapters: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Title is required"),
      description: z.string(),
      sequenceNumber: z.number(),
      videoLength: z.number(),
      sectionId: z.string(),
    }),
  ),
});

const formSchema = z.object({
  sections: z.array(sectionSchema),
});

type UpdateSectionInput = z.infer<typeof formSchema>;

export default function CourseContent({
  courseId,
  sections: initialData,
}: {
  courseId: string;
  sections: UpdateSectionInput["sections"];
}) {
  const updateSectionsMutation = api.courses.updateCourseSections.useMutation({
    onSuccess: () => {
      setIsChangesPending(false);
      form.reset(undefined, {
        keepValues: true,
        keepDirtyValues: false,
        keepDirty: false,
      });
      toast.success("Sections updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating sections:", error);
      toast.error("Failed to update sections. Please try again.");
    },
  });

  const deleteSectionMutation = api.courses.deleteSection.useMutation({
    onSuccess: () => {
      toast.success("Section deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting section:", error);
      toast.error("Failed to delete section. Please try again.");
    },
  });

  const deleteChapterMutation = api.courses.deleteChapter.useMutation({
    onSuccess: () => {
      toast.success("Chapter deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting chapter:", error);
      toast.error("Failed to delete chapter. Please try again.");
    },
  });

  const [, setIsChangesPending] = useState(false);
  const { control, handleSubmit, ...form } = useForm<UpdateSectionInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sections: initialData || [],
    },
  });
  useEffect(() => {
    setIsChangesPending(form.formState.isDirty);
    console.log("Form state:", form.formState.isDirty);
  }, [form.formState.isDirty]);

  const {
    fields: sections,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: "sections",
    keyName: "renderId",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent, sectionId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sectionIndex = sections.findIndex(
        (section) => section.id === sectionId,
      );

      if (sectionIndex !== -1) {
        const section = sections[sectionIndex];
        if (!section) return;
        const oldIndex = section.chapters.findIndex(
          (chapter) => chapter.id === active.id,
        );
        const newIndex = section.chapters.findIndex(
          (chapter) => chapter.id === over.id,
        );

        const updatedChapters = arrayMove(
          section.chapters,
          oldIndex,
          newIndex,
        ).map((chapter, index) => ({
          ...chapter,
          sequenceNumber: index + 1,
        }));
        console.log("Updated chapters:", updatedChapters);
        update(sectionIndex, { ...section, chapters: updatedChapters });
      }
    }
  };

  const addSection = () => {
    append({
      id: uuid(),
      title: `New Section - ${sections.length + 1}`,
      sequenceNumber: sections.length + 1,
      courseId,
      chapters: [],
    });
  };

  const addChapter = (sectionId: string) => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId,
    );

    if (sectionIndex !== -1) {
      const section = sections[sectionIndex];
      if (!section) return;
      const newChapter = {
        id: uuid(),
        title: `New Chapter - ${(section?.chapters.length || 0) + 1}`,
        description: "",
        videoUrl: "",
        sequenceNumber: (section?.chapters.length || 0) + 1,
        videoLength: 0,
        sectionId: section?.id,
      };

      const updatedChapters = [...section.chapters, newChapter];

      update(sectionIndex, { ...section, chapters: updatedChapters });
    }
  };

  const saveChanges = handleSubmit((data) => {
    updateSectionsMutation.mutate({ sections: data.sections, courseId });
    console.log("Updated sections:", data);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Content</CardTitle>
        <Button onClick={addSection}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {sections.map((section, index) => (
          <DndContext
            key={section.id}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, section.id)}
          >
            <CourseSection
              section={section}
              onAddChapter={() => addChapter(section.id)}
              onUpdateTitle={(newTitle) =>
                update(index, { ...section, title: newTitle })
              }
              onDeleteSection={() => {
                deleteSectionMutation.mutate({
                  sectionId: section.id,
                });
                sections.filter((s) => s.id !== section.id);
                remove(index);
              }}
              onDeleteChapter={(chapterId) => {
                const updatedChapters = section.chapters.filter(
                  (chapter) => chapter.id !== chapterId,
                );
                update(index, { ...section, chapters: updatedChapters });
                deleteChapterMutation.mutate({
                  chapterId: chapterId,
                });
              }}
            />
          </DndContext>
        ))}
        <Button
          disabled={updateSectionsMutation.isPending}
          onClick={saveChanges}
          className="ml-auto mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {updateSectionsMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>

      {/* {isChangesPending && (
        <div className="">
          <Toast
            state={
              updateSectionsMutation.isPending
                ? "loading"
                : updateSectionsMutation.data
                  ? "success"
                  : "initial"
            }
            onSave={saveChanges}
            onReset={() => form.reset()}
          />
        </div>
      )} */}
    </Card>
  );
}
