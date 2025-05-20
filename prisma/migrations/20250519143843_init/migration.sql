-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_method_id_fkey";

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "method_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_method_id_fkey" FOREIGN KEY ("method_id") REFERENCES "methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
