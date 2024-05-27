-- AlterTable
ALTER TABLE "Fnbs" ADD COLUMN     "discount_percent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "discount_status" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "order_discount_percent" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
