/*
  Warnings:

  - You are about to drop the column `modifier_id` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_modifier_id_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "modifier_id";

-- CreateTable
CREATE TABLE "modifier_item" (
    "modifier_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "modifier_item_pkey" PRIMARY KEY ("modifier_id","item_id")
);

-- AddForeignKey
ALTER TABLE "modifier_item" ADD CONSTRAINT "modifier_item_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_item" ADD CONSTRAINT "modifier_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
