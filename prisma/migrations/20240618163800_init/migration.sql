-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "deleted_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refund_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refund_target_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "refunded_order_amount" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "order_price" SET DATA TYPE DOUBLE PRECISION[],
ALTER COLUMN "order_discount_percent" SET DATA TYPE DOUBLE PRECISION[];
