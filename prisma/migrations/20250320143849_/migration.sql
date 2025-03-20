-- CreateTable
CREATE TABLE "OrphanImage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "uploadThingId" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrphanImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrphanImage_expiredAt_idx" ON "OrphanImage"("expiredAt");
