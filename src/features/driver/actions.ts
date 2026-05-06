"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { type ActionResult, fail, ok } from "@/lib/action-result";

const DRIVER_ACCESS_COOKIE = "driver_portal_code";

const STATUS_FLOW: Record<string, string> = {
  CREATED: "DRIVER_EN_ROUTE",
  DRIVER_ASSIGNED: "DRIVER_EN_ROUTE",
  DRIVER_EN_ROUTE: "ARRIVED_PICKUP",
  ARRIVED_PICKUP: "LOADING",
  LOADING: "LOADED",
  LOADED: "IN_TRANSIT",
  IN_TRANSIT: "ARRIVED_DESTINATION",
  ARRIVED_DESTINATION: "UNLOADING",
  UNLOADING: "DELIVERED",
};

export type DriverPortalData = {
  jobId: number;
  currentStatus: string;
  trackingId: string | null;
  accessCode: string;
  driverName: string | null;
  driverPhone: string | null;
  pickupAddress: string;
  deliveryAddress: string;
  distanceKm: number | null;
  truckType: string;
  plateNumber: string;
};

function normalizeCode(rawCode: string): string {
  return rawCode.trim().toUpperCase();
}

function canUseCode(expiresAt: Date | null, isActive: boolean): boolean {
  if (!isActive) return false;
  if (!expiresAt) return true;
  return expiresAt.getTime() > Date.now();
}

async function getCodeRecord(code: string) {
  return prisma.driverAccessCode.findUnique({
    where: { code },
    include: {
      job: {
        include: {
          shipment: {
            include: {
              pickupLocation: true,
              deliveryLocation: true,
            },
          },
          truck: true,
          driver: {
            include: {
              user: {
                select: {
                  name: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function signInDriverWithCode(rawCode: string): Promise<ActionResult<{ redirectTo: string }>> {
  const code = normalizeCode(rawCode);
  if (!code) return fail("Please enter a valid driver code");

  const access = await getCodeRecord(code);
  if (!access || !canUseCode(access.expiresAt ?? null, access.isActive)) {
    return fail("Invalid or expired driver code");
  }

  const cookieStore = await cookies();
  cookieStore.set(DRIVER_ACCESS_COOKIE, code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  if (!access.usedAt) {
    await prisma.driverAccessCode.update({
      where: { id: access.id },
      data: { usedAt: new Date() },
    });
  }

  return ok("Driver access granted", { redirectTo: "/driver/active-delivery" });
}

export async function signOutDriverPortal(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DRIVER_ACCESS_COOKIE);
}

export async function getDriverPortalDataFromSession(): Promise<DriverPortalData | null> {
  const cookieStore = await cookies();
  const code = cookieStore.get(DRIVER_ACCESS_COOKIE)?.value;
  if (!code) return null;

  const access = await getCodeRecord(code);
  if (!access || !canUseCode(access.expiresAt ?? null, access.isActive)) {
    cookieStore.delete(DRIVER_ACCESS_COOKIE);
    return null;
  }

  return {
    jobId: access.job.id,
    currentStatus: access.job.status,
    trackingId: access.job.shipment.trackingId,
    accessCode: access.code,
    driverName: access.job.driver.user.name,
    driverPhone: access.job.driver.user.phoneNumber,
    pickupAddress: access.job.shipment.pickupLocation.address,
    deliveryAddress: access.job.shipment.deliveryLocation.address,
    distanceKm: access.job.shipment.distance,
    truckType: access.job.truck.truckType,
    plateNumber: access.job.truck.plateNumber,
  };
}

export async function updateDriverPortalStatus(newStatus: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const code = cookieStore.get(DRIVER_ACCESS_COOKIE)?.value;
  if (!code) return fail("Driver session expired. Please re-enter your code.");

  const access = await getCodeRecord(code);
  if (!access || !canUseCode(access.expiresAt ?? null, access.isActive)) {
    cookieStore.delete(DRIVER_ACCESS_COOKIE);
    return fail("Driver code is invalid or expired.");
  }

  const currentStatus = access.job.status;
  if (currentStatus === "DELIVERED") {
    return fail("This delivery is already completed.");
  }

  const allowedNext = STATUS_FLOW[currentStatus];
  if (allowedNext && newStatus !== allowedNext) {
    return fail(`Invalid status transition. Next step is ${allowedNext}.`);
  }

  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === "DRIVER_EN_ROUTE") updateData.startedAt = new Date();
  if (newStatus === "DELIVERED") updateData.completedAt = new Date();

  await prisma.job.update({
    where: { id: access.job.id },
    data: updateData,
  });

  revalidatePath("/driver/active-delivery");
  revalidatePath("/track-shipment");
  revalidatePath("/dashboard/carrier/active_jobs");
  revalidatePath("/dashboard/shipper");
  revalidatePath("/dashboard/shipper/my_shipment");

  return ok("Delivery status updated.");
}

export async function getTrackingByTrackingId(rawTrackingId: string): Promise<ActionResult<DriverPortalData>> {
  const trackingId = rawTrackingId.trim().toUpperCase();
  if (!trackingId) return fail("Please enter a tracking ID.");

  const shipment = await prisma.shipment.findUnique({
    where: { trackingId },
    include: {
      pickupLocation: true,
      deliveryLocation: true,
      job: {
        include: {
          truck: true,
          driver: {
            include: {
              user: {
                select: {
                  name: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!shipment || !shipment.job) {
    return fail("Tracking ID not found.");
  }

  return ok("Tracking found.", {
    jobId: shipment.job.id,
    currentStatus: shipment.job.status,
    trackingId: shipment.trackingId,
    accessCode: "",
    driverName: shipment.job.driver.user.name,
    driverPhone: shipment.job.driver.user.phoneNumber,
    pickupAddress: shipment.pickupLocation.address,
    deliveryAddress: shipment.deliveryLocation.address,
    distanceKm: shipment.distance,
    truckType: shipment.job.truck.truckType,
    plateNumber: shipment.job.truck.plateNumber,
  });
}
