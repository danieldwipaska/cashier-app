/*
  Warnings:

  - The primary key for the `CrewPurchaseCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CrewPurchaseCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CrewPurchaseCategory" DROP CONSTRAINT "CrewPurchaseCategory_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CrewPurchaseCategory_pkey" PRIMARY KEY ("backoffice_setting_id", "category_id");
