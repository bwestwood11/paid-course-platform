import { utapi } from "@/lib/uploadthing";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  const orphanImage = await db.orphanImage.findMany({
    where: {
      expiredAt: {
        lt: new Date(),
      },
    },
    take: 10,
  });

  if (orphanImage.length === 0) {
    return NextResponse.json({
      success: "No orphan images found",
    });
  }

  await utapi.deleteFiles(orphanImage.map((image) => image.uploadThingId));

  await db.orphanImage.deleteMany({
    where: {
      id: {
        in: orphanImage.map((image) => image.id),
      },
    },
  });

  return NextResponse.json({
    success: "Deleted Successfully",
    length: orphanImage.length,
  });
}
