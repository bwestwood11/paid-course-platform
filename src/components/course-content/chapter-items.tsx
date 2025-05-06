"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, Trash2, PencilIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Duration } from "luxon";

interface Chapter {
  description: string;
  id: string;
  title: string;
  sequenceNumber: number;
  videoLength: number;
  sectionId: string;
}

interface ChapterItemProps {
  chapter: Chapter;
  onDeleteChapter: () => void;
}

export default function ChapterItem({
  chapter,
  onDeleteChapter,
}: ChapterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      suppressHydrationWarning
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <Card className="border border-muted">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="cursor-grab touch-none" {...listeners}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium">{chapter.title}</h3>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {chapter.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{Duration.fromMillis(chapter.videoLength * 1000).shiftTo("minutes", "seconds").toHuman({ unitDisplay: "narrow" })}</span>
            </div>
            <Link
              href={`./content/${chapter.id}/edit`}
              className="text-sm text-primary hover:underline"
            >
              <PencilIcon className="h-4 w-4" />
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{chapter.title}&quot;? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteChapter}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
