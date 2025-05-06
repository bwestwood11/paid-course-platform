-- CreateIndex
CREATE INDEX "Chapter_sequenceNumber_idx" ON "Chapter"("sequenceNumber");

-- CreateIndex
CREATE INDEX "Section_sequenceNumber_idx" ON "Section"("sequenceNumber");

-- CreateIndex
CREATE INDEX "Section_courseId_idx" ON "Section"("courseId");
