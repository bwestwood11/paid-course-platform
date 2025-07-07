"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Play } from "lucide-react"
import { useState } from "react"

export function CourseContent() {
  const [expandedSections, setExpandedSections] = useState<number[]>([0])

  const courseContent = [
    {
      title: "01: Intro",
      duration: "22min",
      lessons: [
        { title: "Introduction", duration: "2 min" },
        { title: "What is Figma?", duration: "5 min" },
        { title: "Understanding Figma", duration: "12 min" },
        { title: "UI tour", duration: "3 min" },
      ],
    },
    {
      title: "02: Intermediate Level Stuff",
      duration: "1h 20min",
      lessons: [],
    },
    {
      title: "03: Advanced Stuff",
      duration: "35min",
      lessons: [],
    },
    {
      title: "04: Imports & Graphics",
      duration: "40min",
      lessons: [],
    },
    {
      title: "05: Component in Figma",
      duration: "1h 12min",
      lessons: [],
    },
    {
      title: "06: Styles in Figma",
      duration: "41min",
      lessons: [],
    },
    {
      title: "07: Summary",
      duration: "8min",
      lessons: [],
    },
  ]

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Course content</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {courseContent.map((section, index) => (
            <div key={index} className="border-b border-gray-100 last:border-b-0">
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto font-normal"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-3">
                  {expandedSections.includes(index) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{section.title}</span>
                </div>
                <span className="text-sm text-gray-500">{section.duration}</span>
              </Button>

              {expandedSections.includes(index) && section.lessons.length > 0 && (
                <div className="pb-2">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <Button
                      key={lessonIndex}
                      variant="ghost"
                      className="w-full justify-between px-12 py-2 h-auto font-normal text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <Play className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">{lesson.duration}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
