-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "refund_item_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
