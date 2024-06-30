/*
  Warnings:

  - Added the required column `report_id` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "report_id" TEXT NOT NULL;
