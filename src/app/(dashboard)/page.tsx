import Dashboard from "@/components/dashboard/dashboard";
import PageLayout from "@/components/layout/page-layout";
const breadcrumb = [
  { title: "Dashboard" },
];

export default async function Home() {


  return (
    <PageLayout breadcrumb={breadcrumb}>
      <Dashboard />
      {/* <LoginModal /> */}
    </PageLayout>
  );
}
