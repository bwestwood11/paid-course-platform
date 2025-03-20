import { CourseForm } from '@/components/admin/course-form'
import PageLayout from '@/components/layout/page-layout'
import React from 'react'

const CreateNewCourse = () => {
  return (
    <PageLayout breadcrumb={[{ title: 'Admin', href: '/admin' }, { title: 'Courses', href: '/admin/courses' }, { title: 'Create New Course' }]}>
        <div className='container mx-auto px-4 py-8 space-y-8'>
        <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      <CourseForm />
        </div>
    </PageLayout>
  )
}

export default CreateNewCourse