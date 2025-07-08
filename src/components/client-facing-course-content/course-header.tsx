import { Badge } from "@/components/ui/badge";
import type { GetCourseById } from "@/types/courses";
import { Star, Clock, BookOpen } from "lucide-react";

export function CourseHeader({course}: {course: GetCourseById}) {
  return (
    <div className="space-y-4">
      {/* Course Title and Actions */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              {course.course?.title}
            </h1>
            <Badge variant="secondary" className="bg-foreground text-primary">
             {course.course?.tags[0]}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-foreground/70">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.course?._count.sections} Sections</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.course?._count.quizzes} Quizzes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.courseLength}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
