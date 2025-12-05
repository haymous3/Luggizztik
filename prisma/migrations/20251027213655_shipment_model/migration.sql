-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "cargoType" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "deliveryLocation" TEXT NOT NULL,
    "additionalNote" TEXT,
    "budgetId" INTEGER NOT NULL,
    "budget" JSONB NOT NULL,
    "weight" INTEGER NOT NULL,
    "shipperId" INTEGER NOT NULL,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "bids" TEXT[],
    "distance" INTEGER,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shipment_shipperId_idx" ON "Shipment"("shipperId");

-- CreateIndex
CREATE INDEX "Shipment_urgent_idx" ON "Shipment"("urgent");

-- CreateIndex
CREATE INDEX "Shipment_pickupDate_idx" ON "Shipment"("pickupDate");

-- CreateIndex
CREATE INDEX "Shipment_deliveryDate_idx" ON "Shipment"("deliveryDate");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_companyName_idx" ON "User"("companyName");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
