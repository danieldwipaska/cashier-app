-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "order_discount_status" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[];
