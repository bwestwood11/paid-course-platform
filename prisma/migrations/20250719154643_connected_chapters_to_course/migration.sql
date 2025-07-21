/*
  Warnings:

  - A unique constraint covering the columns `[courseId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "courseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_courseId_key" ON "Chapter"("courseId");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
