import { CourseContent } from "@/components/client-facing-course-content/course-content";
import { CourseDetails } from "@/components/client-facing-course-content/course-details";
import { CourseHeader } from "@/components/client-facing-course-content/course-header";
import GetStartedButton from "@/components/client-facing-course-content/get-started-button";
import type { AppRouter } from "@/server/api/root";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import type { inferRouterOutputs } from "@trpc/server";

import React from "react";

const GetStartedPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const session = await auth();
  const { courseId } = await params;
  if (!courseId)
    return <div className="p-6 text-destructive">Invalid course ID.</div>;

  let course: inferRouterOutputs<AppRouter>["courses"]["getCourseById"];
  try {
    course = await api.courses.getCourseById({ courseId });
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return (
      <div className="p-6 text-destructive">
        Something went wrong while loading the course. Please try again later.
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-destructive">
        Course not found or may have been removed.
      </div>
    );
  }
  const hasStartedCourse =
    course.userCourseProgress?.percentComplete && session?.user.datePaid;
  return (
    <div className="flex flex-1">
      <main className="flex-1 p-6">
        <CourseHeader course={course} />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CourseDetails course={course} />
          </div>
          <div className="lg:col-span-1">
            {!hasStartedCourse ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted p-8 shadow-md">
                <h2 className="mb-2 text-center text-xl font-semibold">
                  Unlock This Course
                </h2>
                <p className="mb-6 text-center text-muted-foreground">
                  Get full access to all lessons, resources, and community
                  support by enrolling now.
                </p>
                <GetStartedButton courseId={courseId} session={session} />
              </div>
            ) : (
              <CourseContent activeChapterId={undefined} courseId={courseId} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStartedPage;
