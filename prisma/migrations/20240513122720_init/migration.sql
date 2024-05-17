/*
  Warnings:

  - You are about to drop the column `action` on the `Report` table. All the data in the column will be lost.
  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "action",
ADD COLUMN     "type" TEXT NOT NULL;
