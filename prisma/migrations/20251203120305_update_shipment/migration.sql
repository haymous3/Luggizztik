/*
  Warnings:

  - A unique constraint covering the columns `[acceptedBidId]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_TRANSIT', 'ARRIVED_PICKUP', 'LOADED', 'EN_ROUTE', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "acceptedBidId" INTEGER;

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "bidId" INTEGER NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "currentLat" DOUBLE PRECISION,
    "currentLng" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_shipmentId_key" ON "Job"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_bidId_key" ON "Job"("bidId");

-- CreateIndex
CREATE INDEX "Job_driverId_idx" ON "Job"("driverId");

-- CreateIndex
CREATE INDEX "Job_shipmentId_idx" ON "Job"("shipmentId");

-- CreateIndex
CREATE INDEX "Job_bidId_idx" ON "Job"("bidId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_acceptedBidId_key" ON "Shipment"("acceptedBidId");

-- CreateIndex
CREATE INDEX "Shipment_acceptedBidId_idx" ON "Shipment"("acceptedBidId");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_acceptedBidId_fkey" FOREIGN KEY ("acceptedBidId") REFERENCES "Bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
