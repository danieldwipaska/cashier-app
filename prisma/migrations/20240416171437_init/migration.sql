/*
  Warnings:

  - The `created_at` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_at` column on the `Fnbs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `Fnbs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_at` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Fnbs" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
