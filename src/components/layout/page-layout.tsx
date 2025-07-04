import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { HydrateClient } from "@/trpc/server";
import LayoutBreadcrumb, { type LayoutBreadcrumbType } from "../ui/layout-breadcrumb";

const PageLayout = ({ children, breadcrumb }: { children: React.ReactNode, breadcrumb: LayoutBreadcrumbType[] }) => {
  return (
    <HydrateClient>
      {/* <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1 text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4" />
       <LayoutBreadcrumb  breadcrumbs={breadcrumb} />  
      </header> */}
      <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
    </HydrateClient>
  );
};

export default PageLayout;
