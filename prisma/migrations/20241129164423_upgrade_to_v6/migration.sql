-- AlterTable
ALTER TABLE "_LikedVideos" ADD CONSTRAINT "_LikedVideos_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_LikedVideos_AB_unique";

-- AlterTable
ALTER TABLE "_PlaylistToVideo" ADD CONSTRAINT "_PlaylistToVideo_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PlaylistToVideo_AB_unique";

-- AlterTable
ALTER TABLE "_WatchLater" ADD CONSTRAINT "_WatchLater_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_WatchLater_AB_unique";
