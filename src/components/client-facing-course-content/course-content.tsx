"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Play, CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";


export function CourseContent({
  activeChapterId,
  courseId,
}: {
  activeChapterId: string | undefined;
  courseId: string;
}) {
  const { data: courseContent } = api.courses.getCourseContent.useQuery({
    courseId,
  });
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    if (!courseContent) return;
    const activeSectionIndex = courseContent.sections.findIndex((section) =>
      section.chapters.some((chapter) => chapter.id === activeChapterId),
    );
    if (activeSectionIndex !== -1) {
      setExpandedSections((prev) =>
        prev.includes(activeSectionIndex)
          ? prev
          : [...prev, activeSectionIndex],
      );
    }
  }, [courseContent, activeChapterId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Course content</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {courseContent?.sections.map((section, index) => (
            <div
              key={index}
              className="border-b border-foreground/20 last:border-b-0"
            >
              <Button
                variant="ghost"
                className="h-auto w-full justify-between p-4 font-normal"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-3">
                  {expandedSections.includes(index) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {section.title}
                  </span>
                </div>
                <span className="text-sm text-foreground/60">
                  {section.sequenceNumber}
                </span>
              </Button>

              {expandedSections.includes(index) &&
                section.chapters.length > 0 && (
                  <div className="pb-2">
                    {section.chapters.map((lesson, lessonIndex) => (
                      <Button
                        asChild
                        key={lessonIndex}
                        variant={
                          lesson.id === activeChapterId ? "secondary" : "ghost"
                        }
                        className={`h-auto w-full justify-between px-12 py-2 font-normal text-foreground ${
                          lesson.id === activeChapterId ? "bg-secondary" : ""
                        }`}
                      >
                        <Link
                          href={`/courses/${courseId}/${lesson.id}`}
                          className="flex w-full items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {courseContent.completed.includes(lesson.id) && <CheckIcon className="h-3 w-3 text-green-500" />}
                            <Play className="h-3 w-3 text-foreground" />
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-foreground">
                            {lesson.videoLength} seconds
                          </span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
