import PageLayout from '@/components/layout/page-layout'
import React from 'react'

const CreateNewCourse = () => {
  return (
    <PageLayout breadcrumb={[{ title: 'Admin', href: '/admin' }, { title: 'Courses', href: '/admin/courses' }, { title: 'Create New Course' }]}>
        <div>

        </div>
    </PageLayout>
  )
}

export default CreateNewCourse