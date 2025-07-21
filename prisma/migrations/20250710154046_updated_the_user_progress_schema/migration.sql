/*
  Warnings:

  - You are about to drop the column `completedChapters` on the `UserCourseProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserCourseProgress" DROP COLUMN "completedChapters";

-- CreateTable
CREATE TABLE "_ChapterToUserCourseProgress" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChapterToUserCourseProgress_AB_unique" ON "_ChapterToUserCourseProgress"("A", "B");

-- CreateIndex
CREATE INDEX "_ChapterToUserCourseProgress_B_index" ON "_ChapterToUserCourseProgress"("B");

-- AddForeignKey
ALTER TABLE "_ChapterToUserCourseProgress" ADD CONSTRAINT "_ChapterToUserCourseProgress_A_fkey" FOREIGN KEY ("A") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChapterToUserCourseProgress" ADD CONSTRAINT "_ChapterToUserCourseProgress_B_fkey" FOREIGN KEY ("B") REFERENCES "UserCourseProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
