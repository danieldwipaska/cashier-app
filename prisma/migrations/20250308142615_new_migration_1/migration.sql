/*
  Warnings:

  - You are about to drop the column `tax_service_included` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `total_tax_service` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `service_status` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `tax_status` on the `Shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "tax_service_included",
DROP COLUMN "total_tax_service",
ADD COLUMN     "included_tax_service" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "total_tax" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "service_status",
DROP COLUMN "tax_status";
