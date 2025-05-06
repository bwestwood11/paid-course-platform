"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Check, X, Trash2 } from "lucide-react"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/alert-dialog"
import ChapterItem from "./chapter-items"

interface Chapter {
  description: string;
  id: string;
  title: string;
  sequenceNumber: number;
  videoLength: number;
  sectionId: string;
}

interface Section {
  id: string;
  title: string;
  courseId: string;
  sequenceNumber: number;
  chapters: Chapter[];
}


interface CourseSectionProps {
  section: Section
  onAddChapter: () => void
  onUpdateTitle: (newTitle: string) => void
  onDeleteSection: () => void
  onDeleteChapter: (chapterId: string) => void
}

export default function CourseSection({
  section,
  onAddChapter,
  onUpdateTitle,
  onDeleteSection,
  onDeleteChapter,
}: CourseSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState(section.title)

  const handleSave = () => {
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle)
    } else {
      setTempTitle(section.title)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempTitle(section.title)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="h-8 w-[200px]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave()
                  if (e.key === "Escape") handleCancel()
                }}
              />
              <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Section</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the &quot;{section.title}&quot; section? This will remove all chapters
                      within this section and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDeleteSection}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={onAddChapter}>
          <Plus className="h-4 w-4 mr-2" />
          Add Chapter
        </Button>
      </CardHeader>
      <CardContent>
        <SortableContext items={section.chapters.map((chapter) => chapter.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {section.chapters.map((chapter) => (
              <ChapterItem key={chapter.id} chapter={chapter} onDeleteChapter={() => onDeleteChapter(chapter.id)} />
            ))}
            {section.chapters.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No chapters yet. Add your first chapter to get started.
              </p>
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  )
}

