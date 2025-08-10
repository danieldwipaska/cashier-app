-- AlterTable
ALTER TABLE "items" ADD COLUMN     "modifier_id" TEXT,
ADD COLUMN     "note" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "modifiers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "modifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fnb_modifiers" (
    "modifier_id" TEXT NOT NULL,
    "fnb_id" TEXT NOT NULL,

    CONSTRAINT "fnb_modifiers_pkey" PRIMARY KEY ("modifier_id","fnb_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modifiers_code_key" ON "modifiers"("code");

-- AddForeignKey
ALTER TABLE "modifiers" ADD CONSTRAINT "modifiers_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnb_modifiers" ADD CONSTRAINT "fnb_modifiers_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnb_modifiers" ADD CONSTRAINT "fnb_modifiers_fnb_id_fkey" FOREIGN KEY ("fnb_id") REFERENCES "fnbs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
