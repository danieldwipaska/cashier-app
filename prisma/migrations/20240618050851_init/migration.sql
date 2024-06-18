-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "total_payment" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "service_percent" SET DEFAULT 0,
ALTER COLUMN "service_percent" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tax_percent" SET DEFAULT 0,
ALTER COLUMN "tax_percent" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total_tax_service" SET DEFAULT 0,
ALTER COLUMN "total_tax_service" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total_payment_after_tax_service" SET DEFAULT 0,
ALTER COLUMN "total_payment_after_tax_service" SET DATA TYPE DOUBLE PRECISION;