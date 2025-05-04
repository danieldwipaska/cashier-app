/*
  Warnings:

  - The primary key for the `CrewPurchaseCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `crew_id` on the `CrewPurchaseCategory` table. All the data in the column will be lost.
  - The required column `id` was added to the `CrewPurchaseCategory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "CrewPurchaseCategory" DROP CONSTRAINT "CrewPurchaseCategory_crew_id_fkey";

-- DropIndex
DROP INDEX "CrewPurchaseCategory_backoffice_setting_id_key";

-- AlterTable
ALTER TABLE "CrewPurchaseCategory" DROP CONSTRAINT "CrewPurchaseCategory_pkey",
DROP COLUMN "crew_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CrewPurchaseCategory_pkey" PRIMARY KEY ("id");
