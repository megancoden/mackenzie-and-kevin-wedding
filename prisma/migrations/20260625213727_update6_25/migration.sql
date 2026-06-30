/*
  Warnings:

  - The values [CHILD] on the enum `GuestType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `phone` on the `Guest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MealPreference" AS ENUM ('CHICKEN', 'SALMON', 'VEGETARIAN');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."GuestType_new" AS ENUM ('NAMED_GUEST', 'PLUS_ONE');
ALTER TABLE "public"."Guest" ALTER COLUMN "guestType" DROP DEFAULT;
ALTER TABLE "public"."Guest" ALTER COLUMN "guestType" TYPE "public"."GuestType_new" USING ("guestType"::text::"public"."GuestType_new");
ALTER TYPE "public"."GuestType" RENAME TO "GuestType_old";
ALTER TYPE "public"."GuestType_new" RENAME TO "GuestType";
DROP TYPE "public"."GuestType_old";
ALTER TABLE "public"."Guest" ALTER COLUMN "guestType" SET DEFAULT 'NAMED_GUEST';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Guest" DROP COLUMN "phone",
ADD COLUMN     "dinnerRequest" "public"."MealPreference";
