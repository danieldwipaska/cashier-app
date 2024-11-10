-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "Total_tax_service" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "service_percent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tax_percent" INTEGER NOT NULL DEFAULT 0;
