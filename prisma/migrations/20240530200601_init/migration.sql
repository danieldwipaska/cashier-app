-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "service_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tax_status" BOOLEAN NOT NULL DEFAULT false;
