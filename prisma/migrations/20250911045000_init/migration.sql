-- CreateEnum
CREATE TYPE "public"."GuestType" AS ENUM ('NAMED_GUEST', 'PLUS_ONE', 'CHILD');

-- CreateEnum
CREATE TYPE "public"."RsvpStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."Response" AS ENUM ('YES', 'NO');

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" TEXT NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "invitedToFriday" BOOLEAN NOT NULL DEFAULT false,
    "invitedToSaturday" BOOLEAN NOT NULL DEFAULT true,
    "invitedToSunday" BOOLEAN NOT NULL DEFAULT false,
    "rsvpStatus" "public"."RsvpStatus" NOT NULL DEFAULT 'PENDING',
    "rsvpSubmittedAt" TIMESTAMP(3),
    "dietaryRestrictions" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guest" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "guestType" "public"."GuestType" NOT NULL DEFAULT 'NAMED_GUEST',
    "fridayResponse" "public"."Response",
    "saturdayResponse" "public"."Response",
    "sundayResponse" "public"."Response",
    "invitationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_invitationCode_key" ON "public"."Invitation"("invitationCode");

-- CreateIndex
CREATE INDEX "Guest_firstName_lastName_idx" ON "public"."Guest"("firstName", "lastName");

-- AddForeignKey
ALTER TABLE "public"."Guest" ADD CONSTRAINT "Guest_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
