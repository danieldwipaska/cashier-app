-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "tax_service_included" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "total_payment_after_tax_service" INTEGER NOT NULL DEFAULT 0;
