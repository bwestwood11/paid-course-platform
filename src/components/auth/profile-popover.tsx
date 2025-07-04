"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Settings, LogOut, Plus, HelpCircle } from "lucide-react";
import type { Session } from "next-auth";

export default function ProfilePopover({ session }: { session: Session }) {
  return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 text-foreground" align="end">
            <div className="p-4">
              {/* User Info Section */}
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {session.user.name}
                  </div>
                  <div className="text-sm text-foreground/70">
                    {session.user.email}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-4 space-y-1">
                <Button
                  variant="ghost"
                  className="h-10 w-full justify-start px-3 "
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Manage account
                </Button>
                <Button
                  variant="ghost"
                  className="h-10 w-full justify-start px-3 "
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Add Account */}
              <Button
                variant="ghost"
                className="mb-4 h-10 w-full justify-start px-3 "
              >
                <Plus className="mr-3 h-4 w-4" />
                Add account
              </Button>

              {/* Clerk Branding */}
              <div className="text-center bg-muted">
                <span className="text-xs text-gray-500">
                  Secured by{" "}
                  <span className="font-medium text-gray-700">Next Auth</span>
                </span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
  );
}
