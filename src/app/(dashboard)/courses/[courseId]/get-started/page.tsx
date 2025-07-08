import { CourseDetails } from '@/components/client-facing-course-content/course-details'
import { CourseHeader } from '@/components/client-facing-course-content/course-header'
import { Button } from '@/components/ui/button'
import { auth } from '@/server/auth'
import { api } from '@/trpc/server'
import Link from 'next/link'
import React from 'react'

const GetStartedPage = async ({ params }: { params: Promise<{courseId: string}> }) => {
    const session = await auth()
  const {courseId} = await params
  if (!courseId) return <div className="p-6 text-destructive">Invalid course ID.</div>

  let course

  try {
    course = await api.courses.getCourseById({ courseId })
  } catch (error) {
    console.error('Failed to fetch course:', error)
    return (
      <div className="p-6 text-destructive">
        Something went wrong while loading the course. Please try again later.
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6 text-destructive">
        Course not found or may have been removed.
      </div>
    )
  }

  return (
    <div className="flex flex-1">
      <main className="flex-1 p-6">
        <CourseHeader course={course} />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CourseDetails course={course} />
          </div>
          <div className="lg:col-span-1">
            <div className=' flex flex-col items-center justify-center bg-muted rounded-xl p-8 shadow-md border border-border'>
     <h2 className="text-xl font-semibold mb-2 text-center">Unlock This Course</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Get full access to all lessons, resources, and community support by enrolling now.
            </p>
            <Button
              variant="default"
              className="w-full font-bold py-3 text-lg"
            >
              {!session && "Login to get started"}
              {!session?.user.datePaid && !!session &&  "Purchase to get started"}
              {!!session?.user.datePaid && !!session &&  "Get Started"}
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Already purchased? <Link href="/login" className="underline text-primary">Sign in</Link> to access your course.
            </p>
            </div>
       
          </div>
        </div>
      </main>
    </div>
  )
}

export default GetStartedPage
