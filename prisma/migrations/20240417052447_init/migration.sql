-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "collected_by" TEXT NOT NULL,
    "total_payment" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "order_name" TEXT[],
    "order_amount" INTEGER[],
    "order_price" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
