-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_crew_id_fkey";

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "crew_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
