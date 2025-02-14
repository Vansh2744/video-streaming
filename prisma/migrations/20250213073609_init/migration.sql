/*
  Warnings:

  - You are about to drop the column `likedVideosId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `watchLaterVideosId` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,videoId]` on the table `LikedVideos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,videoId]` on the table `WatchLaterVideos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoId` to the `LikedVideos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `WatchLaterVideos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LikedVideos" DROP CONSTRAINT "LikedVideos_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_likedVideosId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_watchLaterVideosId_fkey";

-- DropForeignKey
ALTER TABLE "WatchLaterVideos" DROP CONSTRAINT "WatchLaterVideos_userId_fkey";

-- AlterTable
ALTER TABLE "LikedVideos" ADD COLUMN     "videoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "likedVideosId",
DROP COLUMN "watchLaterVideosId";

-- AlterTable
ALTER TABLE "WatchLaterVideos" ADD COLUMN     "videoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LikedVideos_userId_videoId_key" ON "LikedVideos"("userId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchLaterVideos_userId_videoId_key" ON "WatchLaterVideos"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "LikedVideos" ADD CONSTRAINT "LikedVideos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedVideos" ADD CONSTRAINT "LikedVideos_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchLaterVideos" ADD CONSTRAINT "WatchLaterVideos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchLaterVideos" ADD CONSTRAINT "WatchLaterVideos_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
