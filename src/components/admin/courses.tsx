"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { format } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { api } from "@/trpc/react";
import Image from "next/image";


// Helper function to get badge color based on difficulty
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    case "intermediate":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "advanced":
      return "bg-red-100 text-red-800 hover:bg-red-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};

const Courses = () => {
  const { data: courses, fetchNextPage } =
    api.courses.getAllAdminCourses.useInfiniteQuery(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        select: (data) => {
          return {
            ...data,
            hasNextPage: data.pages[0]?.hasNextPage,
          };
        },
      },
    );
  if (!courses) return null;
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your course catalog</p>
        </div>
        <Link href="/admin/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.pages
          .flatMap((page) => page.courses)
          .map((course) => (
            <div
              key={course.id}
              className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={course.thumbnail[0]?.url ?? "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge
                    className={getDifficultyColor(course.courseDifficulty)}
                    variant="outline"
                  >
                    {course.courseDifficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(course.createdAt)}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold">
                  {course.title}
                </h3>
                <div className="mt-4 flex justify-end">
                  <Link href={`/admin/courses/${course.id}`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        {courses.hasNextPage && (
          <Button onClick={() => fetchNextPage()}>Load More</Button>
        )}
      </div>
    </div>
  );
};

export default Courses;
