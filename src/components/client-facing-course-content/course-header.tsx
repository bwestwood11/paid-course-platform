import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share, Star, Clock, BookOpen, Bell } from "lucide-react"

export function CourseHeader() {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Button variant="ghost" size="sm" className="p-0 h-auto">
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
        <span>Courses</span>
        <span>/</span>
        <span>UI UX Design</span>
        <span>/</span>
        <span>Figma from A to Z</span>
      </div>

      {/* Course Title and Actions */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Figma from A to Z</h1>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              UI / UX Design
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>38 lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>4h 30min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.5 (126 reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Bell className="w-4 h-4 mr-2" />
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  )
}
