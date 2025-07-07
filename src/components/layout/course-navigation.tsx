"use client"

import { Fragment } from "react";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Code,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "eBook", path: "/asd" },
  { icon: GraduationCap, label: "Courses", path: "/asdas" },
  { icon: Code, label: "Code Challenges", path: "/asdasd" },
  { icon: Users, label: "Community", path: "/asdasd" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Support" },
];

export const Navigation = () => {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <Fragment>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant={item.path === pathname ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  item.path === pathname
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-foreground hover:bg-primary/10"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Bottom Navigation */}
      <div className="p-4">
        <ul className="space-y-2">
          {bottomItems.map((item, index) => (
            <li key={index}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};
