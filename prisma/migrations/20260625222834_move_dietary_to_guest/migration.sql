/*
  Warnings:

  - You are about to drop the column `dietaryRestrictions` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Invitation` table. All the data in the column will be lost.
  - Made the column `saturdayResponse` on table `Guest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dinnerRequest` on table `Guest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Guest" ADD COLUMN     "dietaryRestrictions" TEXT,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "saturdayResponse" SET NOT NULL,
ALTER COLUMN "dinnerRequest" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Invitation" DROP COLUMN "dietaryRestrictions",
DROP COLUMN "notes";
