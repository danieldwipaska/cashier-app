/*
  Warnings:

  - Added the required column `position` to the `Crew` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crew" ADD COLUMN     "position" TEXT NOT NULL;
