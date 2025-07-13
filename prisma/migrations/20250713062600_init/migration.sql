-- DropForeignKey
ALTER TABLE "modifier_item" DROP CONSTRAINT "modifier_item_item_id_fkey";

-- AddForeignKey
ALTER TABLE "modifier_item" ADD CONSTRAINT "modifier_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
