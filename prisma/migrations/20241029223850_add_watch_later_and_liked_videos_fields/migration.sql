-- CreateTable
CREATE TABLE "_WatchLater" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LikedVideos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WatchLater_AB_unique" ON "_WatchLater"("A", "B");

-- CreateIndex
CREATE INDEX "_WatchLater_B_index" ON "_WatchLater"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedVideos_AB_unique" ON "_LikedVideos"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedVideos_B_index" ON "_LikedVideos"("B");

-- AddForeignKey
ALTER TABLE "_WatchLater" ADD CONSTRAINT "_WatchLater_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchLater" ADD CONSTRAINT "_WatchLater_B_fkey" FOREIGN KEY ("B") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedVideos" ADD CONSTRAINT "_LikedVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedVideos" ADD CONSTRAINT "_LikedVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
