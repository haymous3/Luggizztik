"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/features/auth/auth";
import { getCoordinates, getDistanceMatrix } from "@/lib/services";
import { type ActionResult, ok, fail } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export type ShipperActivityRow = {
  id: number;
  name?: string;
  cargoType?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  from?: string;
  to?: string;
  driver?: string;
  status?: string;
  eta?: string;
  price?: string;
  bids?: string[];
};

function jobStatusToDisplay(status: string): string {
  const map: Record<string, string> = {
    CREATED: "Pickup Pending",
    DRIVER_ASSIGNED: "Pickup Pending",
    DRIVER_EN_ROUTE: "Pickup Pending",
    ARRIVED_PICKUP: "Pickup Pending",
    LOADING: "Pickup Pending",
    LOADED: "Transit",
    IN_TRANSIT: "Transit",
    ARRIVED_DESTINATION: "Transit",
    UNLOADING: "Transit",
    DELIVERED: "Delivered",
    COMPLETED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return map[status] ?? status;
}

export async function getShipperRecentActivities(): Promise<ShipperActivityRow[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") {
    return [];
  }

  const shipments = await prisma.shipment.findMany({
    where: { shipperId: userId },
    orderBy: { id: "desc" },
    take: 20,
    include: {
      pickupLocation: true,
      deliveryLocation: true,
      job: {
        include: {
          driver: {
            include: {
              user: { select: { name: true } },
              carrier: { select: { companyName: true } },
            },
          },
        },
      },
      acceptedBid: true,
      bids: { select: { id: true } },
    },
  });

  return shipments.map((s) => {
    const status = s.job
      ? jobStatusToDisplay(s.job.status)
      : "Open for bids";
    const bidCount = s.bids?.length ?? 0;
    const pickup = s.pickupLocation;
    const delivery = s.deliveryLocation;
    return {
      id: s.id,
      name: s.cargoType,
      cargoType: s.cargoType,
      from: pickup.address,
      to: delivery.address,
      pickupLocation: pickup.address,
      deliveryLocation: delivery.address,
      driver: s.job?.driver?.user?.name ?? s.job?.driver?.carrier?.companyName ?? undefined,
      status,
      eta: "-",
      price: s.acceptedBid ? String(s.acceptedBid.amount) : "-",
      bids: bidCount > 0 ? Array.from({ length: bidCount }, () => "") : undefined,
    };
  });
}

export type ShipperStats = {
  activeShipments: number;
  totalSpent: number;
  completedShipments: number;
};

export async function getShipperStats(): Promise<ShipperStats> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") {
    return {activeShipments: 0, totalSpent: 0, completedShipments: 0};
  }

  const shipments = await prisma.shipment.findMany({
    where: {shipperId: userId},
    include: {
      job: {select: {status: true}},
      acceptedBid: {select: {amount: true}},
    },
  });

  let activeShipments = 0;
  let completedShipments = 0;
  let totalSpent = 0;

  for (const s of shipments) {
    if (s.job) {
      if (s.job.status === "DELIVERED") {
        completedShipments++;
        totalSpent += s.acceptedBid?.amount ?? 0;
      } else {
        activeShipments++;
      }
    } else {
      activeShipments++;
    }
  }

  return {activeShipments, totalSpent, completedShipments};
}

async function findOrCreateLocation(address: string) {
  let label = address;
  let lat = 0;
  let lng = 0;

  try {
    const geo = await getCoordinates(address);
    [lng, lat] = geo.coordinate;
    label = geo.name as string;
  } catch {
    // Geocoding failed (missing API key, network error, etc.) -- use raw address
  }

  const parts = label.split(",").map((p: string) => p.trim());
  const city = parts[0] || address;
  const state = parts[1] || "";
  const country = parts[parts.length - 1] || "Nigeria";

  return prisma.location.create({
    data: {
      address: label,
      city,
      state,
      country,
      latitude: lat,
      longitude: lng,
    },
  });
}

export const createShipment = async (formData: FormData): Promise<ActionResult> => {
  try {
    const session = await auth();
    const shipperId = session?.user?.id;

    if (!shipperId) {
      return fail("You must be logged in to create a shipment");
    }

    const cargoType = formData.get("cargoType") as string;
    const weight = Number(formData.get("weight"));
    const pickupAddress = formData.get("pickupLocation") as string;
    const deliveryAddress = formData.get("deliveryLocation") as string;

    if (!cargoType || !pickupAddress || !deliveryAddress) {
      return fail("Please fill in all required fields");
    }

    if (!weight || weight <= 0) {
      return fail("Weight must be a positive number");
    }

    const pickupDate = new Date(formData.get("pickupDate") as string);
    const deliveryDate = new Date(
      (formData.get("deliveryDate") ??
        formData.get("preferedDeliveryDate")) as string
    );

    const additionalNote = formData.get("additionalNote") as string;
    const urgentVal = formData.get("urgent");
    const urgent = urgentVal === "true" || urgentVal === "on";

    const budgetMin = Number(formData.get("budgetRangeFrom"));
    const budgetMax = Number(formData.get("budgetRangeTo"));

    if (!budgetMin || !budgetMax || budgetMin > budgetMax) {
      return fail("Please provide a valid budget range");
    }

    const [pickupLocation, deliveryLocation] = await Promise.all([
      findOrCreateLocation(pickupAddress),
      findOrCreateLocation(deliveryAddress),
    ]);

    let distance: number | null = null;
    try {
      distance = await getDistanceMatrix(pickupAddress, deliveryAddress);
    } catch {
      // Distance calculation failed -- leave as null
    }

    await prisma.shipment.create({
      data: {
        cargoType,
        weight,
        pickupLocationId: pickupLocation.id,
        deliveryLocationId: deliveryLocation.id,
        pickupDate,
        deliveryDate,
        additionalNote,
        urgent,
        budgetMin,
        budgetMax,
        distance,
        shipperId,
      },
    });

    revalidatePath("/dashboard/shipper");
    revalidatePath("/dashboard/shipper/my_shipment");

    return ok("Shipment posted successfully");
  } catch (error: unknown) {
    console.error("Error creating shipment:", error);
    return fail("Failed to create shipment. Please try again.");
  }
};
