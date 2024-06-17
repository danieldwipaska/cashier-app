/*
  Warnings:

  - You are about to drop the column `Total_tax_service` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "Total_tax_service",
ADD COLUMN     "total_tax_service" INTEGER NOT NULL DEFAULT 0;
