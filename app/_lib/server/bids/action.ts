"use server";

import prisma from "@/app/_lib/server/prisma";
import {auth} from "@/app/_lib/server/auth";

export const placeBid = async (formData: FormData) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized: You must be logged in to place a bid");
    }

    const shipmentId = Number(formData.get("shipmentId"));
    const amount = Number(formData.get("amount"));

    if (!shipmentId || isNaN(shipmentId)) {
      throw new Error("Invalid shipment ID");
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid bid amount");
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    const bid = await prisma.bid.create({
      data: {
        amount,
        user: { connect: { id: userId } },
        shipment: { connect: { id: shipmentId } },
      },
    });

    return { success: true, bid };
  } catch (error: unknown) {
    console.error("Error placing bid →", error);

    // Narrow unknown error into an object
    if (typeof error === "object" && error !== null) {
      // Handle Prisma unique constraint error (user already bid)
      if ("code" in error && (error as { code?: string }).code === "P2002") {
        throw new Error("You have already placed a bid on this shipment");
      }
    }

    //  Re-throw original error if it's a real Error object
    if (error instanceof Error) {
      throw error;
    }

    //  Fallback unknown error
    throw new Error("Failed to place bid due to an unknown error");
  }
};


export const getBidders = async (shipmentId: number) => {

  const bids = await prisma.bid.findMany({
  where: { shipmentId },
  orderBy: { createdAt: "desc" }, // newest first (or use amount)
  include: {
    user: {
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        companyName: true,
        truckType: true,
        loadCapacity: true,
        plateNumber: true,
      },
    },
  },
});


return bids
}

export const selectBidder = async (shipmentId: number, bidId: number) => {
  const session = await auth();
  const shipperId = session?.user?.id;

  if (!shipperId) throw new Error("Unauthorized");

  // Wrap it in a transaction to avoid partial updates
  return await prisma.$transaction(async (tx) => {
    // verify shipment belongs to this shipper
    const shipment = await tx.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment || shipment.shipperId !== shipperId)
      throw new Error("Not your shipment");

    // get the selected bid
    const bid = await tx.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid) throw new Error("Bid not found");

    // 1. Update shipment's selected bid
    await tx.shipment.update({
      where: { id: shipmentId },
      data: { acceptedBidId: bidId },
    });

    // 2. Create the job
    const job = await tx.job.create({
      data: {
        shipmentId,
        driverId: bid.userId,
        bidId,
        status: "PENDING",
      },
    });

    return job;
  });
};
