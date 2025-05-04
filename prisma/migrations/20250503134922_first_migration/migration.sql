/*
  Warnings:

  - You are about to drop the column `shopId` on the `Crew` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Fnbs` table. All the data in the column will be lost.
  - The primary key for the `UsersOnShops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopId` on the `UsersOnShops` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UsersOnShops` table. All the data in the column will be lost.
  - You are about to drop the `BackofficeSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BackofficeSettingsToCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `setting_id` to the `Crew` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `Crew` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Fnbs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `UsersOnShops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UsersOnShops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Crew" DROP CONSTRAINT "Crew_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Fnbs" DROP CONSTRAINT "Fnbs_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnShops" DROP CONSTRAINT "UsersOnShops_shopId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnShops" DROP CONSTRAINT "UsersOnShops_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BackofficeSettingsToCategory" DROP CONSTRAINT "_BackofficeSettingsToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BackofficeSettingsToCategory" DROP CONSTRAINT "_BackofficeSettingsToCategory_B_fkey";

-- AlterTable
ALTER TABLE "Crew" DROP COLUMN "shopId",
ADD COLUMN     "setting_id" TEXT NOT NULL,
ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Fnbs" DROP COLUMN "categoryId",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UsersOnShops" DROP CONSTRAINT "UsersOnShops_pkey",
DROP COLUMN "shopId",
DROP COLUMN "userId",
ADD COLUMN     "shop_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "UsersOnShops_pkey" PRIMARY KEY ("shop_id", "user_id");

-- DropTable
DROP TABLE "BackofficeSettings";

-- DropTable
DROP TABLE "_BackofficeSettingsToCategory";

-- CreateTable
CREATE TABLE "CrewPurchaseCategory" (
    "category_id" TEXT NOT NULL,
    "crew_setting_id" TEXT NOT NULL,

    CONSTRAINT "CrewPurchaseCategory_pkey" PRIMARY KEY ("category_id","crew_setting_id")
);

-- CreateTable
CREATE TABLE "CrewSetting" (
    "id" TEXT NOT NULL,
    "backoffice_setting_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrewSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackofficeSetting" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackofficeSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrewSetting_backoffice_setting_id_key" ON "CrewSetting"("backoffice_setting_id");

-- AddForeignKey
ALTER TABLE "UsersOnShops" ADD CONSTRAINT "UsersOnShops_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnShops" ADD CONSTRAINT "UsersOnShops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewPurchaseCategory" ADD CONSTRAINT "CrewPurchaseCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewPurchaseCategory" ADD CONSTRAINT "CrewPurchaseCategory_crew_setting_id_fkey" FOREIGN KEY ("crew_setting_id") REFERENCES "CrewSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fnbs" ADD CONSTRAINT "Fnbs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "CrewSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewSetting" ADD CONSTRAINT "CrewSetting_backoffice_setting_id_fkey" FOREIGN KEY ("backoffice_setting_id") REFERENCES "BackofficeSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
