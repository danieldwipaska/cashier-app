/*
  Warnings:

  - You are about to drop the column `shopId` on the `User` table. All the data in the column will be lost.
  - Changed the type of `position` on the `Crew` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('PAY', 'REFUND', 'TOPUP_AND_ACTIVATE', 'TOPUP', 'ADJUSTMENT', 'CHECKOUT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PAID', 'UNPAID', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_shopId_fkey";

-- AlterTable
ALTER TABLE "Crew" DROP COLUMN "position",
ADD COLUMN     "position" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "type",
ADD COLUMN     "type" "ReportType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "shopId";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "UsersOnShops" (
    "shopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UsersOnShops_pkey" PRIMARY KEY ("shopId","userId")
);

-- AddForeignKey
ALTER TABLE "UsersOnShops" ADD CONSTRAINT "UsersOnShops_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnShops" ADD CONSTRAINT "UsersOnShops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
