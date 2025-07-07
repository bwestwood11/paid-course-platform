import React from "react";
import { Button } from "../ui/button";
import { Bell, MessageSquare } from "lucide-react";
import { auth } from "@/server/auth";
import { LoginModal } from "../auth/login-modal";
import ProfilePopover from "../auth/profile-popover";
import { MobileCourseSidebar } from "./mobile-sidebar";

const Navbar = async () => {
  const session = await auth();
  console.log("Session in Navbar:", session);
  return (
    <header className="sticky top-0 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {/* Mobile Sidebar */}
          <MobileCourseSidebar session={session} />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {session ? (
            <div className="flex items-center gap-2">
              <ProfilePopover session={session} />
            </div>
          ) : null}

          {!session ? <LoginModal /> : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
