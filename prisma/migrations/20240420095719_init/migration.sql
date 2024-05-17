-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "deposit" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "is_member" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);
