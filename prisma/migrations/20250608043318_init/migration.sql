-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('PAY', 'TOPUP_AND_ACTIVATE', 'TOPUP', 'ADJUSTMENT', 'CHECKOUT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PAID', 'UNPAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'GREETER', 'SERVER');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('SERVER', 'BARTENDER', 'GREETER');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discount_status" BOOLEAN NOT NULL DEFAULT false,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "discount_unit" TEXT NOT NULL DEFAULT 'percent',
    "tax" INTEGER NOT NULL DEFAULT 0,
    "service" INTEGER NOT NULL DEFAULT 0,
    "included_tax_service" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_on_shops" (
    "shop_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "users_on_shops_pkey" PRIMARY KEY ("shop_id","user_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_purchase_categories" (
    "backoffice_setting_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "crew_purchase_categories_pkey" PRIMARY KEY ("backoffice_setting_id","category_id")
);

-- CreateTable
CREATE TABLE "fnbs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "discount_status" BOOLEAN NOT NULL DEFAULT false,
    "discount_percent" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" TEXT NOT NULL,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "fnbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "fnb_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "refunded_amount" INTEGER NOT NULL DEFAULT 0,
    "discount_percent" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "report_id" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL DEFAULT '',
    "type" "ReportType" NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL DEFAULT '',
    "card_number" TEXT NOT NULL DEFAULT '',
    "initial_balance" INTEGER NOT NULL DEFAULT 0,
    "final_balance" INTEGER NOT NULL DEFAULT 0,
    "total_payment" DOUBLE PRECISION NOT NULL,
    "included_tax_service" BOOLEAN NOT NULL DEFAULT false,
    "total_payment_after_tax_service" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "service_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_id" TEXT NOT NULL,
    "crew_id" TEXT NOT NULL,
    "method_id" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL DEFAULT '',
    "customer_name" TEXT NOT NULL DEFAULT '',
    "balance" INTEGER NOT NULL DEFAULT 0,
    "status" "CardStatus" NOT NULL DEFAULT 'INACTIVE',
    "is_member" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crews" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "position" "Position" NOT NULL,
    "shop_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backoffice_settings" (
    "id" TEXT NOT NULL,
    "shop_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backoffice_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "shops_code_key" ON "shops"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "fnbs_name_key" ON "fnbs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cards_card_number_key" ON "cards"("card_number");

-- CreateIndex
CREATE UNIQUE INDEX "crews_name_key" ON "crews"("name");

-- CreateIndex
CREATE UNIQUE INDEX "crews_code_key" ON "crews"("code");

-- CreateIndex
CREATE UNIQUE INDEX "backoffice_settings_shop_id_key" ON "backoffice_settings"("shop_id");

-- AddForeignKey
ALTER TABLE "users_on_shops" ADD CONSTRAINT "users_on_shops_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_shops" ADD CONSTRAINT "users_on_shops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_purchase_categories" ADD CONSTRAINT "crew_purchase_categories_backoffice_setting_id_fkey" FOREIGN KEY ("backoffice_setting_id") REFERENCES "backoffice_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_purchase_categories" ADD CONSTRAINT "crew_purchase_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnbs" ADD CONSTRAINT "fnbs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnbs" ADD CONSTRAINT "fnbs_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_fnb_id_fkey" FOREIGN KEY ("fnb_id") REFERENCES "fnbs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_method_id_fkey" FOREIGN KEY ("method_id") REFERENCES "methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crews" ADD CONSTRAINT "crews_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backoffice_settings" ADD CONSTRAINT "backoffice_settings_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "methods" ADD CONSTRAINT "methods_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
