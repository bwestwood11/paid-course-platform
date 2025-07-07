"use client";

import { ChevronDown, GraduationCap, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import type { Session } from "next-auth";
import { Navigation } from "./course-navigation";

export function MobileCourseSidebar({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        className="p-3 h-[68px]"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6 text-foreground" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="fixed left-0 top-0 h-full w-64 bg-muted shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-5 w-5 text-foreground" />
                </div>
                <span className="font-semibold text-foreground">Courses</span>
              </div>
              <button
                className="p-2"
                aria-label="Close sidebar"
                onClick={() => setOpen(false)}
              >
                <ChevronDown className="h-5 w-5 text-foreground rotate-90" />
              </button>
            </div>
            {session ? (
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user.image ?? ""} />
                    <AvatarFallback className="text-foreground">
                      {session?.user?.name?.[0] ?? "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">
                        {session?.user.name ?? "User"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex-1 overflow-y-auto">
              <Navigation />
            </div>
          </div>
          {/* Click outside to close */}
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );

}