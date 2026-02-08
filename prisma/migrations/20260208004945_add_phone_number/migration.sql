-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('CONFIRMED', 'PENDING', 'CANCELLED', 'RESCHEDULED', 'CHECKED_IN');

-- CreateEnum
CREATE TYPE "AuditActionType" AS ENUM ('CREATED', 'CANCELLED', 'MOVED', 'CHECKED_IN', 'MODIFIED');

-- CreateEnum
CREATE TYPE "WaitingListStatus" AS ENUM ('PENDING', 'NOTIFIED', 'CONFIRMED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "department" TEXT,
    "phoneNumber" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "employeeId" TEXT,
    "employeeName" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "serialNumber" TEXT NOT NULL,
    "qrCodeString" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitingList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "requestedSeats" INTEGER NOT NULL,
    "priorityScore" INTEGER NOT NULL DEFAULT 0,
    "status" "WaitingListStatus" NOT NULL DEFAULT 'PENDING',
    "isNotified" BOOLEAN NOT NULL DEFAULT false,
    "notificationSentAt" TIMESTAMP(3),
    "confirmationDeadline" TIMESTAMP(3),
    "confirmationToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT,
    "userId" TEXT NOT NULL,
    "actionType" "AuditActionType" NOT NULL,
    "metadata" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiddleEpisode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiddleEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiddleQuestion" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiddleQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiddleAnswer" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiddleAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaffleSettings" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "numberOfWinners" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "raffleDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RaffleSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaffleWinner" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "answerId" TEXT,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "selectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaffleWinner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WellnessContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WellnessContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_employeeId_idx" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_serialNumber_key" ON "Reservation"("serialNumber");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_employeeId_idx" ON "Reservation"("employeeId");

-- CreateIndex
CREATE INDEX "Reservation_email_idx" ON "Reservation"("email");

-- CreateIndex
CREATE INDEX "Reservation_reservationDate_idx" ON "Reservation"("reservationDate");

-- CreateIndex
CREATE INDEX "Reservation_serialNumber_idx" ON "Reservation"("serialNumber");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WaitingList_confirmationToken_key" ON "WaitingList"("confirmationToken");

-- CreateIndex
CREATE INDEX "WaitingList_userId_idx" ON "WaitingList"("userId");

-- CreateIndex
CREATE INDEX "WaitingList_targetDate_idx" ON "WaitingList"("targetDate");

-- CreateIndex
CREATE INDEX "WaitingList_priorityScore_idx" ON "WaitingList"("priorityScore");

-- CreateIndex
CREATE INDEX "WaitingList_status_idx" ON "WaitingList"("status");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_reservationId_idx" ON "AuditLog"("reservationId");

-- CreateIndex
CREATE INDEX "AuditLog_actionType_idx" ON "AuditLog"("actionType");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "RiddleEpisode_episodeNumber_key" ON "RiddleEpisode"("episodeNumber");

-- CreateIndex
CREATE INDEX "RiddleEpisode_episodeNumber_idx" ON "RiddleEpisode"("episodeNumber");

-- CreateIndex
CREATE INDEX "RiddleEpisode_isActive_idx" ON "RiddleEpisode"("isActive");

-- CreateIndex
CREATE INDEX "RiddleQuestion_episodeId_idx" ON "RiddleQuestion"("episodeId");

-- CreateIndex
CREATE INDEX "RiddleAnswer_episodeId_idx" ON "RiddleAnswer"("episodeId");

-- CreateIndex
CREATE INDEX "RiddleAnswer_questionId_idx" ON "RiddleAnswer"("questionId");

-- CreateIndex
CREATE INDEX "RiddleAnswer_employeeId_idx" ON "RiddleAnswer"("employeeId");

-- CreateIndex
CREATE INDEX "RiddleAnswer_email_idx" ON "RiddleAnswer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RaffleSettings_episodeId_key" ON "RaffleSettings"("episodeId");

-- CreateIndex
CREATE INDEX "RaffleSettings_episodeId_idx" ON "RaffleSettings"("episodeId");

-- CreateIndex
CREATE INDEX "RaffleWinner_episodeId_idx" ON "RaffleWinner"("episodeId");

-- CreateIndex
CREATE INDEX "RaffleWinner_employeeId_idx" ON "RaffleWinner"("employeeId");

-- CreateIndex
CREATE INDEX "RaffleWinner_email_idx" ON "RaffleWinner"("email");

-- CreateIndex
CREATE INDEX "WellnessContent_displayOrder_idx" ON "WellnessContent"("displayOrder");

-- CreateIndex
CREATE INDEX "WellnessContent_isActive_idx" ON "WellnessContent"("isActive");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitingList" ADD CONSTRAINT "WaitingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiddleQuestion" ADD CONSTRAINT "RiddleQuestion_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "RiddleEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiddleAnswer" ADD CONSTRAINT "RiddleAnswer_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "RiddleEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiddleAnswer" ADD CONSTRAINT "RiddleAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "RiddleQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaffleSettings" ADD CONSTRAINT "RaffleSettings_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "RiddleEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaffleWinner" ADD CONSTRAINT "RaffleWinner_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "RiddleEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
