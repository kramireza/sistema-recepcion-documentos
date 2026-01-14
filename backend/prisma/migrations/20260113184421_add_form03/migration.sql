/*
  Warnings:

  - Added the required column `form03Path` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "form03Path" TEXT NOT NULL;
