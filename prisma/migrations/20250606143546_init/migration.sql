/*
  Warnings:

  - The values [REFUND] on the enum `ReportType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `refund_item_ids` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `refund_status` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `refund_target_id` on the `reports` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportType_new" AS ENUM ('PAY', 'TOPUP_AND_ACTIVATE', 'TOPUP', 'ADJUSTMENT', 'CHECKOUT');
ALTER TABLE "reports" ALTER COLUMN "type" TYPE "ReportType_new" USING ("type"::text::"ReportType_new");
ALTER TYPE "ReportType" RENAME TO "ReportType_old";
ALTER TYPE "ReportType_new" RENAME TO "ReportType";
DROP TYPE "ReportType_old";
COMMIT;

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "refund_item_ids",
DROP COLUMN "refund_status",
DROP COLUMN "refund_target_id";
