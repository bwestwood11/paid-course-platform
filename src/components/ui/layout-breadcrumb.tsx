import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

export type LayoutBreadcrumbType = {
  title: string;
  href?: string;
};

const LayoutBreadcrumb = ({
  breadcrumbs,
}: {
  breadcrumbs: LayoutBreadcrumbType[];
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.slice(0, -1).map((item) => {
          return (
            <div
              key={`${item.title} breadcrumb`}
              className="flex items-center gap-2"
            >
              <BreadcrumbItem className="hidden md:block">
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </div>
          );
        })}

        <BreadcrumbItem>
          <BreadcrumbPage>
            {breadcrumbs[breadcrumbs.length - 1]?.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default LayoutBreadcrumb;