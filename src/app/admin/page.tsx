import Courses from "@/components/admin/courses";
import PageLayout from "@/components/layout/page-layout";
import React from "react";
const breadcrumb = [{ title: "Admin", href: "/admin" }, { title: "Dashboard" }];

const AdminPage = () => {
  return (
    <PageLayout breadcrumb={breadcrumb}>
      <div>
        <Courses />
      </div>
    </PageLayout>
  );
};

export default AdminPage;
