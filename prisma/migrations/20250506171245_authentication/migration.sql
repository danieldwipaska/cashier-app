/*
  Warnings:

  - Added the required column `shop_id` to the `Fnbs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fnbs" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Fnbs" ADD CONSTRAINT "Fnbs_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
