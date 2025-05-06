/*
  Warnings:

  - A unique constraint covering the columns `[uploadThingId]` on the table `Trailer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Trailer" ADD COLUMN     "uploadThingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Trailer_uploadThingId_key" ON "Trailer"("uploadThingId");
