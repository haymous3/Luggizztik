-- CreateEnum
CREATE TYPE "Role" AS ENUM ('carrier', 'shipper');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'shipper',
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;
