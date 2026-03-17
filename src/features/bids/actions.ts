"use server";

import prisma from "@/lib/prisma";
import {auth} from "@/features/auth/auth";
import {type ActionResult, ok, fail} from "@/lib/action-result";
import {revalidatePath} from "next/cache";

export const placeBid = async (formData: FormData): Promise<ActionResult> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return fail("You must be logged in to place a bid");
    }

    const shipmentId = Number(formData.get("shipmentId"));
    const amount = Number(formData.get("amount"));

    if (!shipmentId || isNaN(shipmentId)) {
      return fail("Invalid shipment");
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return fail("Please enter a valid bid amount");
    }

    const shipment = await prisma.shipment.findUnique({
      where: {id: shipmentId},
    });

    if (!shipment) {
      return fail("Shipment not found");
    }

    await prisma.bid.create({
      data: {
        amount,
        user: {connect: {id: userId}},
        shipment: {connect: {id: shipmentId}},
      },
    });

    revalidatePath("/dashboard/carrier/find_loads");

    return ok("Bid placed successfully");
  } catch (error: unknown) {
    console.error("Error placing bid:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as {code?: string}).code === "P2002") {
        return fail("You have already placed a bid on this shipment");
      }
    }

    return fail("Failed to place bid. Please try again.");
  }
};

export const getBidders = async (shipmentId: number) => {
  const bids = await prisma.bid.findMany({
    where: {shipmentId, status: "PENDING"},
    orderBy: {createdAt: "desc"},
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
        },
      },
    },
  });

  return bids;
};

export const selectBidder = async (
  shipmentId: number,
  bidId: number
): Promise<ActionResult> => {
  try {
    const session = await auth();
    const shipperId = session?.user?.id;

    if (!shipperId) return fail("You must be logged in");

    return await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({
        where: {id: shipmentId},
      });

      if (!shipment || shipment.shipperId !== shipperId) {
        return fail("Shipment not found or unauthorized");
      }

      if (shipment.acceptedBidId) {
        return fail("A bid has already been accepted for this shipment");
      }

      const bid = await tx.bid.findUnique({
        where: {id: bidId},
        include: {user: {select: {id: true, name: true}}},
      });

      if (!bid) return fail("Bid not found");

      let driver = await tx.driver.findUnique({
        where: {userId: bid.userId},
      });

      if (!driver) {
        let carrier = await tx.carrierCompany.findUnique({
          where: {userId: bid.userId},
        });

        if (!carrier) {
          const bidderUser = await tx.user.findUnique({
            where: {id: bid.userId},
            select: {name: true, role: true},
          });

          if (!bidderUser || bidderUser.role !== "carrier") {
            return fail("This bidder is not registered as a carrier");
          }

          carrier = await tx.carrierCompany.create({
            data: {
              userId: bid.userId,
              companyName: bidderUser.name ?? `Carrier-${bid.userId}`,
            },
          });
        }

        driver = await tx.driver.create({
          data: {
            userId: bid.userId,
            carrierId: carrier.id,
            licenseNumber: "PENDING",
          },
        });
      }

      let truck = await tx.truck.findFirst({
        where: {carrierId: driver.carrierId, status: "AVAILABLE"},
      });

      if (!truck) {
        truck = await tx.truck.create({
          data: {
            carrierId: driver.carrierId,
            driverId: driver.id,
            truckType: "General",
            loadCapacity: 0,
            plateNumber: `PENDING-${Date.now()}`,
            yearOfManufacture: new Date().getFullYear(),
          },
        });
      }

      await tx.bid.update({
        where: {id: bidId},
        data: {status: "ACCEPTED"},
      });

      await tx.bid.updateMany({
        where: {shipmentId, id: {not: bidId}, status: "PENDING"},
        data: {status: "REJECTED"},
      });

      await tx.shipment.update({
        where: {id: shipmentId},
        data: {acceptedBidId: bidId},
      });

      await tx.job.create({
        data: {
          shipmentId,
          driverId: driver.id,
          driverUserId: bid.userId,
          truckId: truck.id,
          bidId,
          status: "CREATED",
        },
      });

      revalidatePath("/dashboard/shipper/active_bids");
      revalidatePath("/dashboard/carrier/find_loads");
      revalidatePath("/dashboard/carrier/active_jobs");

      const carrierName = bid.user.name ?? "The carrier";
      return ok(
        `Bid accepted! ${carrierName} has been assigned to this shipment and will be contacted shortly.`
      );
    });
  } catch (error: unknown) {
    console.error("Error selecting bidder:", error);
    return fail("Failed to accept bid. Please try again.");
  }
};

export const declineBid = async (
  shipmentId: number,
  bidId: number
): Promise<ActionResult> => {
  try {
    const session = await auth();
    const shipperId = session?.user?.id;

    if (!shipperId) return fail("You must be logged in");

    const shipment = await prisma.shipment.findUnique({
      where: {id: shipmentId},
    });

    if (!shipment || shipment.shipperId !== shipperId) {
      return fail("Shipment not found or unauthorized");
    }

    const bid = await prisma.bid.findUnique({
      where: {id: bidId},
    });

    if (!bid) return fail("Bid not found");
    if (bid.status !== "PENDING") return fail("This bid has already been processed");

    await prisma.bid.update({
      where: {id: bidId},
      data: {status: "REJECTED"},
    });

    revalidatePath("/dashboard/shipper/active_bids");
    revalidatePath("/dashboard/carrier/find_loads");

    return ok("Bid has been declined");
  } catch (error: unknown) {
    console.error("Error declining bid:", error);
    return fail("Failed to decline bid. Please try again.");
  }
};
