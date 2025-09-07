/*
  Warnings:

  - You are about to drop the column `encryptedSSN` on the `User` table. All the data in the column will be lost.
  - Added the required column `ssn` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "encryptedSSN",
ADD COLUMN     "ssn" TEXT NOT NULL;
