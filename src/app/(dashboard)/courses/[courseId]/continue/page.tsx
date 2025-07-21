import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

const getNextUnwatchedChapter = async (userId: string, courseId: string) => {
  // Get user's completed chapter IDs
  const userProgress = await db.userCourseProgress.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      completedChapters: {
        select: { id: true },
      },
    },
  });

  const completedChapterIds =
    userProgress?.completedChapters.map((c) => c.id) ?? [];

  // Fetch next unwatched chapter ordered by:
  // section.sequenceNumber ASC, chapter.sequenceNumber ASC
  const nextChapter = await db.chapter.findFirst({
    where: {
      courseId,
      id: {
        notIn: completedChapterIds,
      },
    },
    orderBy: [
      {
        section: {
          sequenceNumber: "asc",
        },
      },
      {
        sequenceNumber: "asc",
      },
    ],
    include: {
      section: true,
    },
  });

  if (!nextChapter) {
    const firstChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
    });

    return firstChapter;
  }

  return nextChapter;
};

const ContinueCourse = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const session = await auth();
  const { courseId } = await params;

  if (!session?.user.id || !session.user.datePaid) {
    return redirect(`/courses/${courseId}/get-started`);
  }

  const nextChapter = await getNextUnwatchedChapter(session?.user.id, courseId);
  console.log(nextChapter);
  if (!nextChapter?.id) {
    return redirect(`/courses/${courseId}/get-started`);
  }

  return redirect(`/courses/${courseId}/${nextChapter.id}`);
};

export default ContinueCourse;
