/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Chapter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[muxAssetId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[muxUploadId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[muxPlaybackId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[muxTrackId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uploadThingId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `muxUploadId` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "videoUrl",
ADD COLUMN     "muxAssetId" TEXT,
ADD COLUMN     "muxPlaybackId" TEXT,
ADD COLUMN     "muxStatus" "TrailerStatus",
ADD COLUMN     "muxTrackId" TEXT,
ADD COLUMN     "muxTrackStatus" TEXT,
ADD COLUMN     "muxUploadId" TEXT NOT NULL,
ADD COLUMN     "previewUrl" TEXT,
ADD COLUMN     "uploadThingId" TEXT,
ALTER COLUMN "thumbnail" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_muxAssetId_key" ON "Chapter"("muxAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_muxUploadId_key" ON "Chapter"("muxUploadId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_muxPlaybackId_key" ON "Chapter"("muxPlaybackId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_muxTrackId_key" ON "Chapter"("muxTrackId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_uploadThingId_key" ON "Chapter"("uploadThingId");
