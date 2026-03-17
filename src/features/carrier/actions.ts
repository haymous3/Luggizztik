"use server";

import prisma from "@/lib/prisma";
import {auth} from "@/features/auth/auth";
import {type ActionResult, ok, fail} from "@/lib/action-result";
import {revalidatePath} from "next/cache";

export type CarrierActivityRow = {
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
};

function jobStatusToDisplay(status: string): string {
  const map: Record<string, string> = {
    CREATED: "Pickup Pending",
    DRIVER_ASSIGNED: "Pickup Pending",
    DRIVER_EN_ROUTE: "Pickup Pending",
    ARRIVED_PICKUP: "Pickup Pending",
    LOADING: "Loading",
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

export async function getCarrierRecentActivities(): Promise<
  CarrierActivityRow[]
> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") {
    return [];
  }

  const jobs = await prisma.job.findMany({
    where: {driverUserId: userId},
    orderBy: {updatedAt: "desc"},
    take: 20,
    include: {
      shipment: {
        include: {
          pickupLocation: true,
          deliveryLocation: true,
        },
      },
      bid: true,
      driver: {
        include: {
          user: {select: {name: true}},
          carrier: {select: {companyName: true}},
        },
      },
    },
  });

  return jobs.map((job) => ({
    id: job.id,
    name: job.shipment.cargoType,
    cargoType: job.shipment.cargoType,
    from: job.shipment.pickupLocation.address,
    to: job.shipment.deliveryLocation.address,
    pickupLocation: job.shipment.pickupLocation.address,
    deliveryLocation: job.shipment.deliveryLocation.address,
    driver:
      job.driver?.user?.name ??
      job.driver?.carrier?.companyName ??
      undefined,
    status: jobStatusToDisplay(job.status),
    eta: "-",
    price: String(job.bid.amount),
  }));
}

export type CarrierStats = {
  activeJobs: number;
  completedJobs: number;
  monthEarnings: number;
};

export async function getCarrierStats(): Promise<CarrierStats> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") {
    return {activeJobs: 0, completedJobs: 0, monthEarnings: 0};
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [activeJobs, completedJobs, monthEarningsAgg] = await Promise.all([
    prisma.job.count({
      where: {
        driverUserId: userId,
        status: {notIn: ["DELIVERED", "CANCELLED"]},
      },
    }),
    prisma.job.count({
      where: {
        driverUserId: userId,
        status: "DELIVERED",
      },
    }),
    prisma.job.findMany({
      where: {
        driverUserId: userId,
        status: "DELIVERED",
        completedAt: {gte: startOfMonth},
      },
      include: {bid: {select: {amount: true}}},
    }),
  ]);

  const monthEarnings = monthEarningsAgg.reduce(
    (sum, j) => sum + j.bid.amount,
    0
  );

  return {activeJobs, completedJobs, monthEarnings};
}

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

export async function updateJobStatus(
  jobId: number,
  newStatus: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return fail("You must be logged in");

    const job = await prisma.job.findUnique({where: {id: jobId}});

    if (!job || job.driverUserId !== userId) {
      return fail("Job not found or unauthorized");
    }

    if (job.status === "DELIVERED") {
      return fail("This job has already been delivered");
    }

    const allowedNext = STATUS_FLOW[job.status];
    if (allowedNext && newStatus !== allowedNext) {
      return fail(`Invalid status transition. Next step should be: ${allowedNext}`);
    }

    const data: Record<string, unknown> = {status: newStatus};
    if (newStatus === "DRIVER_EN_ROUTE") data.startedAt = new Date();
    if (newStatus === "DELIVERED") data.completedAt = new Date();

    await prisma.job.update({where: {id: jobId}, data});

    revalidatePath("/dashboard/carrier/active_jobs");
    revalidatePath("/dashboard/carrier");
    revalidatePath("/dashboard/carrier/find_loads");
    revalidatePath("/dashboard/carrier/earnings");
    revalidatePath("/dashboard/shipper");
    revalidatePath("/dashboard/shipper/my_shipment");
    revalidatePath("/dashboard/shipper/active_bids");

    return ok(`Status updated to ${newStatus.replace(/_/g, " ").toLowerCase()}`);
  } catch (error) {
    console.error("Error updating job status:", error);
    return fail("Failed to update status. Please try again.");
  }
}

export type EarningsSummary = {
  thisWeek: number;
  thisMonth: number;
  pending: number;
};

export type PaymentHistoryItem = {
  id: number;
  cargoType: string;
  pickupLocation: string;
  deliveryLocation: string;
  amount: number;
  status: "paid" | "pending";
  completedAt: string | null;
};

export async function getCarrierEarnings(): Promise<{
  summary: EarningsSummary;
  history: PaymentHistoryItem[];
}> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") {
    return {
      summary: {thisWeek: 0, thisMonth: 0, pending: 0},
      history: [],
    };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const jobs = await prisma.job.findMany({
    where: {driverUserId: userId},
    orderBy: {updatedAt: "desc"},
    include: {
      bid: {select: {amount: true}},
      shipment: {
        include: {
          pickupLocation: {select: {address: true}},
          deliveryLocation: {select: {address: true}},
        },
      },
    },
  });

  let thisWeek = 0;
  let thisMonth = 0;
  let pending = 0;

  const history: PaymentHistoryItem[] = [];

  for (const job of jobs) {
    const amount = job.bid.amount;
    const isDelivered = job.status === "DELIVERED";
    const completedDate = job.completedAt;

    if (isDelivered && completedDate) {
      if (completedDate >= startOfMonth) thisMonth += amount;
      if (completedDate >= startOfWeek) thisWeek += amount;
    }

    if (!isDelivered && job.status !== "CANCELLED") {
      pending += amount;
    }

    history.push({
      id: job.id,
      cargoType: job.shipment.cargoType,
      pickupLocation: job.shipment.pickupLocation.address,
      deliveryLocation: job.shipment.deliveryLocation.address,
      amount,
      status: isDelivered ? "paid" : "pending",
      completedAt: completedDate?.toISOString() ?? null,
    });
  }

  return {
    summary: {thisWeek, thisMonth, pending},
    history,
  };
}


export type CarrierProfileData = {
  user: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
    phoneNumber: string;
    profileImageUrl: string | null;
    onboardingCompleted: boolean;
    onboardingStep: number;
    createdAt: string;
  };
  company: {
    id: number;
    companyName: string;
    address: string | null;
  } | null;
  stats: {
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    totalEarnings: number;
    trucksCount: number;
  };
  profile: {
    baseCity: string | null;
    availableDays: string[];
    preferredJobTypes: string[];
    loadTypes: string[];
  } | null;
};

export async function getCarrierProfileData(): Promise<CarrierProfileData | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") return null;

  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phoneNumber: true,
      profileImageUrl: true,
      onboardingCompleted: true,
      onboardingStep: true,
      createdAt: true,
      carrier: {
        select: {
          id: true,
          companyName: true,
          address: true,
          _count: {select: {trucks: true}},
          profile: true,
        },
      },
    },
  });

  if (!user) return null;

  const [totalJobs, activeJobs, completedJobs, earningsAgg] =
    await Promise.all([
      prisma.job.count({where: {driverUserId: userId}}),
      prisma.job.count({
        where: {
          driverUserId: userId,
          status: {notIn: ["DELIVERED", "CANCELLED"]},
        },
      }),
      prisma.job.count({
        where: {driverUserId: userId, status: "DELIVERED"},
      }),
      prisma.job.findMany({
        where: {driverUserId: userId, status: "DELIVERED"},
        include: {bid: {select: {amount: true}}},
      }),
    ]);

  const totalEarnings = earningsAgg.reduce((s, j) => s + j.bid.amount, 0);

  const carrierProfile = user.carrier?.profile;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep,
      createdAt: user.createdAt.toISOString(),
    },
    company: user.carrier
      ? {
          id: user.carrier.id,
          companyName: user.carrier.companyName,
          address: user.carrier.address,
        }
      : null,
    stats: {
      totalJobs,
      activeJobs,
      completedJobs,
      totalEarnings,
      trucksCount: user.carrier?._count.trucks ?? 0,
    },
    profile: carrierProfile
      ? {
          baseCity: carrierProfile.baseCity,
          availableDays: safeJsonParse(carrierProfile.availableDays),
          preferredJobTypes: safeJsonParse(carrierProfile.preferredJobTypes),
          loadTypes: safeJsonParse(carrierProfile.loadTypes),
        }
      : null,
  };
}

function safeJsonParse(val: string | null | undefined): string[] {
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}
