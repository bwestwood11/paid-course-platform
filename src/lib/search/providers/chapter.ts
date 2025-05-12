import { db } from "@/server/db";
import type { SearchResult } from "../types";
import { SearchProviderType } from "../types";
import { BaseSearchProvider } from "./base";

export class ChapterSearchProvider extends BaseSearchProvider {
  type = SearchProviderType.CHAPTER;
  label = "Chapter";
  includeInGlobalSearch = true;

  protected async handleSearch(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const chapters = await db.chapter.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
      include: {
        section: {
          select: {
            courseId: true,
          },
        },
      },
    });

    return chapters.map((list) => {
      return {
        id: list.id,
        title: list.title,
        description: list.description || "No description",
        url: `/admin/courses/${list.section.courseId}/content/${list.id}/edit`,
      };
    });
  }
}

export class CourseSearchProvider extends BaseSearchProvider {
  type = SearchProviderType.COURSE;
  label = "Course";
  includeInGlobalSearch = true;

  protected async handleSearch(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const courses = await db.course.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
    });

    return courses.map((list) => {
      return {
        id: list.id,
        title: list.title,
        description: list.description || "No description",
        url: `/admin/courses/${list.id}`,
      };
    });
  }
}
