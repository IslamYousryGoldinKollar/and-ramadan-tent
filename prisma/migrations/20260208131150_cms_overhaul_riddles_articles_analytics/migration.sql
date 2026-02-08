/*
  Warnings:

  - You are about to drop the column `employeeId` on the `RaffleWinner` table. All the data in the column will be lost.
  - You are about to drop the column `employeeName` on the `RaffleWinner` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `RiddleAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `employeeName` on the `RiddleAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeUrl` on the `RiddleEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `optionD` on the `RiddleQuestion` table. All the data in the column will be lost.
  - You are about to drop the `WellnessContent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idNumber` to the `RaffleWinner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `RaffleWinner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `RiddleAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `RiddleAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `RiddleEpisode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RaffleWinner_employeeId_idx";

-- DropIndex
DROP INDEX "RiddleAnswer_employeeId_idx";

-- AlterTable
ALTER TABLE "RaffleWinner" DROP COLUMN "employeeId",
DROP COLUMN "employeeName",
ADD COLUMN     "idNumber" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiddleAnswer" DROP COLUMN "employeeId",
DROP COLUMN "employeeName",
ADD COLUMN     "idNumber" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiddleEpisode" DROP COLUMN "youtubeUrl",
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiddleQuestion" DROP COLUMN "optionD";

-- DropTable
DROP TABLE "WellnessContent";

-- CreateTable
CREATE TABLE "DailyTip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortTip" TEXT NOT NULL,
    "fullContent" TEXT NOT NULL,
    "tipNumber" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RamadanArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "htmlContent" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RamadanArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "country" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "scrollDepth" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventData" TEXT,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyTip_tipNumber_idx" ON "DailyTip"("tipNumber");

-- CreateIndex
CREATE INDEX "DailyTip_isActive_idx" ON "DailyTip"("isActive");

-- CreateIndex
CREATE INDEX "RamadanArticle_category_idx" ON "RamadanArticle"("category");

-- CreateIndex
CREATE INDEX "RamadanArticle_displayOrder_idx" ON "RamadanArticle"("displayOrder");

-- CreateIndex
CREATE INDEX "RamadanArticle_isActive_idx" ON "RamadanArticle"("isActive");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "PageView_device_idx" ON "PageView"("device");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_idx" ON "AnalyticsEvent"("eventName");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "Upload_mimeType_idx" ON "Upload"("mimeType");

-- CreateIndex
CREATE INDEX "RaffleWinner_idNumber_idx" ON "RaffleWinner"("idNumber");

-- CreateIndex
CREATE INDEX "RiddleAnswer_idNumber_idx" ON "RiddleAnswer"("idNumber");
