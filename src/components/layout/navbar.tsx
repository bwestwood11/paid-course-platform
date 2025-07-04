import React from "react";
import { Button } from "../ui/button";
import { Bell, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { auth } from "@/server/auth";
import { LoginModal } from "../auth/login-modal";
import ProfilePopover from "../auth/profile-popover";


const Navbar = async () => {
    const session = await auth()
  return (
    <div>
      <header className="px-6 py-4">
        <div className=" flex items-center justify-end">
       
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {session ? <div className="flex items-center gap-2">
          <ProfilePopover session={session} />
              {/* <div className="text-sm">
                <div className="font-medium">{session.user.name}</div>
                <div className="text-xs text-gray-500">{session.user.email}</div>
              </div> */}
            </div>
           : null}
           
          {!session ? <LoginModal/> : null}
           </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
