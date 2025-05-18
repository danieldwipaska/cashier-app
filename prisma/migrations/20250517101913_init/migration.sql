/*
  Warnings:

  - Added the required column `shop_id` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `Method` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Method" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Method" ADD CONSTRAINT "Method_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
