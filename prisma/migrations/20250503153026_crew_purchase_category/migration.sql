/*
  Warnings:

  - You are about to drop the column `setting_id` on the `Crew` table. All the data in the column will be lost.
  - The primary key for the `CrewPurchaseCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `crew_setting_id` on the `CrewPurchaseCategory` table. All the data in the column will be lost.
  - You are about to drop the `CrewSetting` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shop_id]` on the table `BackofficeSetting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[backoffice_setting_id]` on the table `CrewPurchaseCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shop_id` to the `BackofficeSetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backoffice_setting_id` to the `CrewPurchaseCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crew_id` to the `CrewPurchaseCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Crew" DROP CONSTRAINT "Crew_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "CrewPurchaseCategory" DROP CONSTRAINT "CrewPurchaseCategory_crew_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "CrewSetting" DROP CONSTRAINT "CrewSetting_backoffice_setting_id_fkey";

-- AlterTable
ALTER TABLE "BackofficeSetting" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Crew" DROP COLUMN "setting_id";

-- AlterTable
ALTER TABLE "CrewPurchaseCategory" DROP CONSTRAINT "CrewPurchaseCategory_pkey",
DROP COLUMN "crew_setting_id",
ADD COLUMN     "backoffice_setting_id" TEXT NOT NULL,
ADD COLUMN     "crew_id" TEXT NOT NULL,
ADD CONSTRAINT "CrewPurchaseCategory_pkey" PRIMARY KEY ("backoffice_setting_id");

-- DropTable
DROP TABLE "CrewSetting";

-- CreateIndex
CREATE UNIQUE INDEX "BackofficeSetting_shop_id_key" ON "BackofficeSetting"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "CrewPurchaseCategory_backoffice_setting_id_key" ON "CrewPurchaseCategory"("backoffice_setting_id");

-- AddForeignKey
ALTER TABLE "CrewPurchaseCategory" ADD CONSTRAINT "CrewPurchaseCategory_backoffice_setting_id_fkey" FOREIGN KEY ("backoffice_setting_id") REFERENCES "BackofficeSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewPurchaseCategory" ADD CONSTRAINT "CrewPurchaseCategory_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackofficeSetting" ADD CONSTRAINT "BackofficeSetting_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
