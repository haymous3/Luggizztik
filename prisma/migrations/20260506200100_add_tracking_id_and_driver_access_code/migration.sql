-- Add public tracking identifier for shipper/driver tracking view
ALTER TABLE "Shipment"
ADD COLUMN "trackingId" TEXT;

CREATE UNIQUE INDEX "Shipment_trackingId_key" ON "Shipment"("trackingId");

-- Driver code used for code-only portal entry
CREATE TABLE "DriverAccessCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverAccessCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DriverAccessCode_code_key" ON "DriverAccessCode"("code");
CREATE UNIQUE INDEX "DriverAccessCode_jobId_key" ON "DriverAccessCode"("jobId");
CREATE INDEX "DriverAccessCode_driverId_idx" ON "DriverAccessCode"("driverId");
CREATE INDEX "DriverAccessCode_isActive_idx" ON "DriverAccessCode"("isActive");

ALTER TABLE "DriverAccessCode"
ADD CONSTRAINT "DriverAccessCode_jobId_fkey"
FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "DriverAccessCode"
ADD CONSTRAINT "DriverAccessCode_driverId_fkey"
FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
