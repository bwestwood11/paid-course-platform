import { z } from "zod";
import { createTRPCRouter, systemAdminProcedure } from "../trpc";
import { mux } from "@/lib/mux";
import { db } from "@/server/db";
import { utapi } from "@/lib/uploadthing";

export const trailerRouter = createTRPCRouter({
  setup: systemAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { courseId } = input;
      const oldTrailer = await db.trailer.findFirst({
        where: {
          courseId,
        },
      });

      if (oldTrailer) {
        await db.trailer.delete({
          where: {
            id: oldTrailer.id,
          },
        });
        if (oldTrailer.muxAssetId) {
          await mux.video.assets.delete(oldTrailer.muxAssetId);
        }
        if (oldTrailer.uploadThingId) {
          await utapi.deleteFiles([oldTrailer.uploadThingId]);
        }
      }

      const upload = await mux.video.uploads.create({
        new_asset_settings: {
          passthrough: JSON.stringify({ courseId, type: "trailer" }),
          playback_policy: ["public"],
        },

        cors_origin: "*",
      });
      console.log(upload.url);
      await db.trailer.create({
        data: {
          title: "Untitled Trailer",
          description: "No description",
          courseId,
          muxStatus: "waiting",
          muxUploadId: upload.id,
        },
      });

      return upload.url;
    }),
  getTrailer: systemAdminProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input }) => {
      const { courseId } = input;
      console.log(courseId);
      const trailer = await db.trailer.findFirst({
        where: {
          courseId,
        },
      });
      console.log(trailer);
      if (!trailer) {
        throw new Error("Trailer not found");
      }

      return trailer;
    }),
  editTrailer: systemAdminProcedure
    .input(
      z.object({
        trailerId: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnail: z.object({
          url: z.string().optional().nullable(),
          id: z.string().optional().nullable(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { trailerId, title, description, thumbnail } = input;
      console.log(thumbnail);
      console.log(thumbnail instanceof File);
      const oldTrailer = await db.trailer.findFirst({
        where: {
          id: trailerId,
        },
      });
      if (!oldTrailer) {
        throw new Error("Trailer not found");
      }

      const isThumbnailChanging =
        oldTrailer.thumbnail !== thumbnail.url

      if (thumbnail.id && isThumbnailChanging) {
        await db.orphanImage.delete({
          where: {
            uploadThingId: thumbnail.id,
          },
        });
      }

      if (isThumbnailChanging && oldTrailer.uploadThingId) {
        await utapi.deleteFiles([oldTrailer.uploadThingId]);
      }

      const trailer = await db.trailer.update({
        where: {
          id: trailerId,
        },
        data: {
          title,
          description,
          thumbnail: thumbnail.url ?? undefined,
          uploadThingId: thumbnail.id ?? undefined,
        },
      });

      return trailer;
    }),
});
