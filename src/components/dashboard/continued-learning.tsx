import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { BookOpen } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { api } from "@/trpc/server";

const ContinuedLearning = async () => {
  const courses = await api.courses.getInProgressCourses({ limit: 2 });
  if (!courses) return null;


const getTotalCount = (watchedCount: number, percentCompleted: number): number => {
  if (percentCompleted === 0) return 0; 
  return Math.round((watchedCount * 100) / percentCompleted);
};

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {courses?.map((course) => (
        <Card key={course.id} className="w-full overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 p-4 xl:flex-row">
              <div className="relative h-full w-full xl:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.course?.thumbnail?.[0]?.url}
                  alt={course.course.title}
                  className="h-full w-full rounded-lg object-cover"
                />
                <Badge className="absolute left-2 top-2 bg-primary/50 text-xs text-primary text-white backdrop-blur-xl">
                  {getTotalCount(course.completedChapters.length, course.percentComplete)} Chapters
                </Badge>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-primary">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">{course.course.tags[0]}</span>
                  </div>
                </div>
                <h3 className="mb-3 line-clamp-2 text-sm font-semibold">
                  {course.course.title}
                </h3>
                <div className="flex gap-8">
                  <div className="mb-3 flex-1">
                    <div className="mb-1 flex items-center gap-2 text-sm">
                      <span className="text-foreground/70">Progress:</span>
                      <span className="font-medium">{course.percentComplete}%</span>
                    </div>
                    <Progress value={course.percentComplete} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" className="mb-2 w-fit">
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContinuedLearning;
