/*
  Warnings:

  - The `position` column on the `Crew` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'bartender', 'server');

-- AlterTable
ALTER TABLE "Crew" DROP COLUMN "position",
ADD COLUMN     "position" "Role" NOT NULL DEFAULT 'admin';
