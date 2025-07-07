import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar";
import { CourseSidebar } from "@/components/layout/course-sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      <CourseSidebar />
      <div className="flex-1">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
