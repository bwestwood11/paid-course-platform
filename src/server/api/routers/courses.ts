import { z } from "zod";

import {
  createTRPCRouter,
  systemAdminProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { getPagination } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { mux } from "@/lib/mux";
import { utapi } from "@/lib/uploadthing";

export const coursesRouter = createTRPCRouter({
  getAllAdminCourses: systemAdminProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().default(10),
      }),
    )
    .query(async ({  input }) => {
      const { cursor, limit } = input;
      const courses = await db.course.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        include: {
          thumbnail: true,
        },
      });

      const { hasNextPage, nextCursor } = getPagination(courses, limit, "id");
      return {
        courses,
        hasNextPage,
        nextCursor,
      };
    }),
  createCourse: systemAdminProcedure
    .input(
      z.object({
        title: z.string().min(3).max(255),
        description: z.string().min(3).max(300),
        courseDifficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
        thumbnail: z.object({
          url: z.string().url(),
          id: z.string(),
          name: z.string(),
        }),
        tags: z.string().array(),
        starterCode: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        title,
        description,
        courseDifficulty,
        thumbnail,
        tags,
        starterCode,
      } = input;

      const newCourse = await db.course.create({
        data: {
          title,
          description,
          courseDifficulty,
          thumbnail: {
            create: {
              url: thumbnail.url,
              name: thumbnail.name,
              uploadThingId: thumbnail.id,
            },
          },
          tags,

          starterCode,
        },
      });

      await db.orphanImage.delete({
        where: {
          uploadThingId: thumbnail.id,
        },
      });
      return newCourse.id;
    }),
  getCourseById: systemAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { courseId } = input;
      const course = await db.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          courseDifficulty: true,
          _count: true,
          tags: true,
          starterCode: true,
          thumbnail: {
            select: {
              url: true,
              name: true,
              uploadThingId: true,
            },
          },
        },
      });
      const { _sum } = await db.chapter.aggregate({
        where: {
          section: {
            courseId,
          },
        },
        _sum: {
          videoLength: true,
        },
      });

      return { course, courseLength: _sum.videoLength };
    }),
  getCourseContent: systemAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { courseId } = input;
      const courseTrailer = await db.trailer.findMany({
        where: {
          courseId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          videoUrl: true,
          courseId: true,
          thumbnail: true,
          muxPlaybackId: true,
        },
      });
      const sections = await db.section.findMany({
        where: {
          courseId,
        },
        select: {
          id: true,
          title: true,
          sequenceNumber: true,
          courseId: true,
          chapters: {
            select: {
              id: true,
              title: true,
              description: true,
              videoLength: true,
              sequenceNumber: true,
              sectionId: true,
            },
          },
        },
      });

      return {
        courseTrailer: courseTrailer?.[0],
        sections,
      };
    }),
  updateCourseDetails: systemAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string().min(3).max(255),
        description: z.string().min(3).max(300),
        courseDifficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
        tags: z.string().array(),
        starterCode: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        title,
        description,
        courseDifficulty,

        tags,
        starterCode,
        courseId,
      } = input;

      const updatedCourse = await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          title,
          description,
          courseDifficulty,
          tags,
          starterCode,
        },
      });

      return updatedCourse.id;
    }),
  getCourseSections: systemAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { courseId } = input;
      const sections = await db.section.findMany({
        where: {
          courseId,
        },
        select: {
          id: true,
          title: true,
          sequenceNumber: true,
          courseId: true,
          chapters: {
            select: {
              id: true,
              title: true,
              description: true,
              videoLength: true,
              sequenceNumber: true,
              sectionId: true,
            },
            orderBy: {
              sequenceNumber: "asc",
            },
          },
        },
        orderBy: {
          sequenceNumber: "asc",
        },
      });

      return sections;
    }),
  updateCourseSections: systemAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
        sections: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            sequenceNumber: z.number(),
            chapters: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                videoLength: z.number(),
                sequenceNumber: z.number(),
                sectionId: z.string(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { courseId, sections } = input;
      console.log("sections", sections);
      const promise = sections.map(async (section) => {
        await db.section.upsert({
          where: {
            id: section.id,
            courseId: courseId,
          },
          update: {
            title: section.title,
            sequenceNumber: section.sequenceNumber,
            chapters: {
              upsert: section.chapters.map((chapter) => ({
                where: {
                  id: chapter.id,
                },
                update: {
                  title: chapter.title,
                  description: chapter.description,

                  videoLength: chapter.videoLength,
                  sequenceNumber: chapter.sequenceNumber,
                  thumbnail: "",
                },
                create: {
                  id: chapter.id,
                  title: chapter.title,
                  description: chapter.description,

                  videoLength: chapter.videoLength,
                  sequenceNumber: chapter.sequenceNumber,
                  thumbnail: "",
                },
              })),
            },
          },
          create: {
            id: section.id,
            title: section.title,
            sequenceNumber: section.sequenceNumber,
            courseId: courseId,
            chapters: {
              create: section.chapters.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                description: chapter.description,

                videoLength: chapter.videoLength,
                sequenceNumber: chapter.sequenceNumber,
                thumbnail: "",
              })),
            },
          },
        });
      });
      const results = await Promise.all(promise);
      console.log("results", results);
    }),
  setupChapterVideo: systemAdminProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { chapterId } = input;
      const chapter = await db.chapter.findUnique({
        where: {
          id: chapterId,
        },
      });
      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }

      if (chapter.muxAssetId) {
        await mux.video.assets.delete(chapter.muxAssetId);
      }
      const upload = await mux.video.uploads.create({
        new_asset_settings: {
          passthrough: JSON.stringify({ chapterId, type: "chapter" }),
          playback_policy: ["public"],
        },

        cors_origin: "*",
      });
      await db.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          muxUploadId: upload.id,
          muxStatus: "waiting",
        },
      });
      return upload.url;
    }),
  getChapter: systemAdminProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { chapterId } = input;
      const chapter = await db.chapter.findUnique({
        where: {
          id: chapterId,
        },
      });
      return chapter;
    }),
  updateChapter: systemAdminProcedure
    .input(
      z.object({
        chapterId: z.string().optional(),
        title: z.string(),
        description: z.string(),
        thumbnail: z.object({
          url: z.string().url().nullable().optional(),
          id: z.string().nullable().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { chapterId, title, description, thumbnail } = input;
      if (!chapterId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }
      const oldChapter = await db.chapter.findUnique({
        where: {
          id: chapterId,
        },
      });
      if (!oldChapter) {
        throw new Error("Trailer not found");
      }

      const isThumbnailChanging = oldChapter.thumbnail !== thumbnail?.url;

      if (thumbnail?.id && isThumbnailChanging) {
        await db.orphanImage.delete({
          where: {
            uploadThingId: thumbnail.id,
          },
        });
      }

      if (isThumbnailChanging && oldChapter.uploadThingId) {
        await utapi.deleteFiles([oldChapter.uploadThingId]);
      }

      const updatedChapter = await db.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          title,
          description,
          thumbnail: thumbnail?.url,
          uploadThingId: thumbnail?.id,
        },
      });
      return updatedChapter.id;
    }),
  deleteChapter: systemAdminProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { chapterId } = input;
      const chapter = await db.chapter.findUnique({
        where: {
          id: chapterId,
        },
      });
      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }
      if (chapter.muxAssetId) {
        await mux.video.assets.delete(chapter.muxAssetId);
      }
      if (chapter.uploadThingId) {
        await utapi.deleteFiles([chapter.uploadThingId]);
      }
      await db.chapter.delete({
        where: {
          id: chapterId,
        },
      });
    }),
  deleteSection: systemAdminProcedure
    .input(
      z.object({
        sectionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { sectionId } = input;
      const section = await db.section.findUnique({
        where: {
          id: sectionId,
        },
        include: {
          chapters: true,
        },
      });
      if (!section) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Section not found",
        });
      }
      if (section.chapters.length > 0) {
        await Promise.all(
          section.chapters.map(async (chapter) => {
            if (chapter.muxAssetId) {
              await mux.video.assets.delete(chapter.muxAssetId);
            }
            if (chapter.uploadThingId) {
              await utapi.deleteFiles([chapter.uploadThingId]);
            }
          }),
        );
      }
      await db.section.delete({
        where: {
          id: sectionId,
        },
      });
    }),
  search: systemAdminProcedure
    .input(
      z.object({
        query: z.string().min(2).max(255),
      }),
    )
    .query(async ({ input }) => {
      const { query } = input;
      if (query.startsWith(":ch")) {
        const chapters = await db.chapter.findMany({
          where: {
            title: {
              contains: query.replace(":ch", ""),
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            title: true,
            description: true,
            videoLength: true,
            sequenceNumber: true,
            sectionId: true,
            section: {
              select: {
                courseId: true,
              },
            },
          },
          take: 10,
        });
        console.log("chapters", chapters);
        return chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          href: `/admin/courses/${chapter.section.courseId}/content/${chapter.id}/edit`,
        }));
      } else return [];
    }),
});
