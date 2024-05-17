/*
  Warnings:

  - Added the required column `served_by` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "served_by" TEXT NOT NULL,
ALTER COLUMN "order_name" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "order_amount" SET DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "order_price" SET DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "order_category" SET DEFAULT ARRAY[]::TEXT[];
