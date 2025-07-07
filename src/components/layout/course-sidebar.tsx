import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap } from "lucide-react";
import { auth } from "@/server/auth";
import { Navigation } from "./course-navigation";


export async function CourseSidebar() {
  const session = await auth();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 h-svh overflow-y-auto sticky top-0 flex-col bg-muted">
        {/* Header */}
        <div className="p-4 ">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-foreground" />
            </div>
            <span className="font-semibold text-foreground">Courses</span>
          </div>
        </div>

        {/* User Profile */}

        <Navigation />
                {session ? (
          <div className="p-4 px-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user.image ?? ""} />
                <AvatarFallback className="text-foreground">
                  {session?.user?.name?.[0] ?? "US"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {session?.user.name ?? "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>


    </>
  );
}
