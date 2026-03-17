-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "Truck" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "profileImageUrl" TEXT;

-- CreateTable
CREATE TABLE "CarrierProfile" (
    "id" SERIAL NOT NULL,
    "carrierId" INTEGER NOT NULL,
    "baseCity" TEXT,
    "preferredRoutes" TEXT,
    "availableDays" TEXT,
    "availableFrom" TEXT,
    "availableTo" TEXT,
    "loadTypes" TEXT,
    "preferredJobTypes" TEXT,
    "minPrice" INTEGER,
    "maxPrice" INTEGER,
    "maxDistance" INTEGER,
    "notifyMatchingJobs" BOOLEAN NOT NULL DEFAULT false,
    "showOutsidePrefs" BOOLEAN NOT NULL DEFAULT false,
    "notifyWorkHoursOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierDocument" (
    "id" SERIAL NOT NULL,
    "carrierId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarrierDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarrierProfile_carrierId_key" ON "CarrierProfile"("carrierId");

-- CreateIndex
CREATE INDEX "CarrierDocument_carrierId_idx" ON "CarrierDocument"("carrierId");

-- AddForeignKey
ALTER TABLE "CarrierProfile" ADD CONSTRAINT "CarrierProfile_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "CarrierCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierDocument" ADD CONSTRAINT "CarrierDocument_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "CarrierCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
