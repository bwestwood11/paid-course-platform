import { CourseEditForm } from "@/components/admin/course-edit-form";
import PageLayout from "@/components/layout/page-layout";
import { api } from "@/trpc/server";
import Image from "next/image";
import React from "react";
type Props = {
  params: Promise<{
    courseId: string;
  }>;
};
const EditCourseDetailsPage = async ({ params }: Props) => {
  const { courseId } = await params;
  const course = await api.courses.getCourseById({ courseId });
  if (!course) return <p>Course not found</p>;
  return (
    <PageLayout
      breadcrumb={[
        { title: "Admin", href: "/admin" },
        { title: "Courses", href: "/admin/courses" },
        { title: "Edit Course" },
      ]}
    >
      <div className="container mx-auto py-6 md:py-10">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">Edit Course</h1>
        <p className="mb-6 text-muted-foreground">Update the course details</p>
        <div className="w-full">
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Course Thumbnail</h2>
            <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg border">
              <Image
                src={course.thumbnail[0]?.url || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Current thumbnail (1280x720px)
            </p>
          </div>
          <CourseEditForm
            course={{
              id: course.id,
              title: course.title,
              description: course.description,
              difficulty: course.courseDifficulty,
              thumbnailUrl: course.thumbnail[0]?.url,
              tags: course.tags,
              githubUrl: course.starterCode,
            }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default EditCourseDetailsPage;
