/*
  Warnings:

  - Changed the type of `position` on the `Crew` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('SERVER', 'BARTENDER', 'GREETER');

-- AlterTable
ALTER TABLE "Crew" DROP COLUMN "position",
ADD COLUMN     "position" "Position" NOT NULL;
