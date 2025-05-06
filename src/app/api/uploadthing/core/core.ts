import { getCurrentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await getCurrentUser(true)
      
      // If you throw, the user will not be able to upload
      if (!user || !user.user.isSystemAdmin) throw new UploadThingError("Only admin can upload images");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      try {
          await db.orphanImage.create({
            data: {
              url: file.ufsUrl,
              uploadThingId: file.key,
              expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
            }
          })
      } catch (error) {
        console.error("Error saving file to database:", error);
        throw new UploadThingError("Failed to save file to database");
      }
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
