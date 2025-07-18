/*
  Warnings:

  - A unique constraint covering the columns `[shop_id,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id,name]` on the table `crews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id,code]` on the table `crews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id,name]` on the table `fnbs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id,name]` on the table `methods` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id,code]` on the table `modifiers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id,report_id]` on the table `reports` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "backoffice_settings" DROP CONSTRAINT "backoffice_settings_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "crew_purchase_categories" DROP CONSTRAINT "crew_purchase_categories_backoffice_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "crew_purchase_categories" DROP CONSTRAINT "crew_purchase_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "crews" DROP CONSTRAINT "crews_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "fnb_modifiers" DROP CONSTRAINT "fnb_modifiers_fnb_id_fkey";

-- DropForeignKey
ALTER TABLE "fnb_modifiers" DROP CONSTRAINT "fnb_modifiers_modifier_id_fkey";

-- DropForeignKey
ALTER TABLE "fnbs" DROP CONSTRAINT "fnbs_category_id_fkey";

-- DropForeignKey
ALTER TABLE "fnbs" DROP CONSTRAINT "fnbs_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "methods" DROP CONSTRAINT "methods_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "modifier_item" DROP CONSTRAINT "modifier_item_modifier_id_fkey";

-- DropForeignKey
ALTER TABLE "modifiers" DROP CONSTRAINT "modifiers_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_shops" DROP CONSTRAINT "users_on_shops_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_shops" DROP CONSTRAINT "users_on_shops_user_id_fkey";

-- DropIndex
DROP INDEX "categories_name_key";

-- DropIndex
DROP INDEX "crews_code_key";

-- DropIndex
DROP INDEX "crews_name_key";

-- DropIndex
DROP INDEX "fnbs_name_key";

-- DropIndex
DROP INDEX "modifiers_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "categories_shop_id_name_key" ON "categories"("shop_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "crews_shop_id_name_key" ON "crews"("shop_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "crews_shop_id_code_key" ON "crews"("shop_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "fnbs_shop_id_name_key" ON "fnbs"("shop_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "methods_shop_id_name_key" ON "methods"("shop_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "modifiers_shop_id_code_key" ON "modifiers"("shop_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "reports_shop_id_report_id_key" ON "reports"("shop_id", "report_id");

-- AddForeignKey
ALTER TABLE "users_on_shops" ADD CONSTRAINT "users_on_shops_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_shops" ADD CONSTRAINT "users_on_shops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnbs" ADD CONSTRAINT "fnbs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnbs" ADD CONSTRAINT "fnbs_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifiers" ADD CONSTRAINT "modifiers_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnb_modifiers" ADD CONSTRAINT "fnb_modifiers_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnb_modifiers" ADD CONSTRAINT "fnb_modifiers_fnb_id_fkey" FOREIGN KEY ("fnb_id") REFERENCES "fnbs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backoffice_settings" ADD CONSTRAINT "backoffice_settings_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_purchase_categories" ADD CONSTRAINT "crew_purchase_categories_backoffice_setting_id_fkey" FOREIGN KEY ("backoffice_setting_id") REFERENCES "backoffice_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_purchase_categories" ADD CONSTRAINT "crew_purchase_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crews" ADD CONSTRAINT "crews_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "methods" ADD CONSTRAINT "methods_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_item" ADD CONSTRAINT "modifier_item_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
