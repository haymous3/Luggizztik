"use server";

import prisma from "@/lib/prisma";
import {auth} from "@/features/auth/auth";
import {type ActionResult, ok, fail} from "@/lib/action-result";
import {revalidatePath} from "next/cache";

export type OnboardingData = {
  step1: {
    truckType: string;
    plateNumber: string;
    loadCapacity: string;
    condition: string;
  };
  step2: {
    baseCity: string;
    preferredRoutes: string;
    availableDays: string[];
    availableFrom: string;
    availableTo: string;
    loadTypes: string[];
  };
  step3: {
    preferredJobTypes: string[];
    minPrice: string;
    maxPrice: string;
    maxDistance: string;
    notifyMatchingJobs: boolean;
    showOutsidePrefs: boolean;
    notifyWorkHoursOnly: boolean;
  };
  step4: {
    truckRegistration: string;
    insurance: string;
    roadworthiness: string;
    driverLicense: string;
    profilePhoto: string;
  };
};

export async function getOnboardingState(): Promise<{
  currentStep: number;
  completed: boolean;
} | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || typeof userId !== "number") return null;

  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {onboardingStep: true, onboardingCompleted: true},
  });

  return user
    ? {currentStep: user.onboardingStep, completed: user.onboardingCompleted}
    : null;
}

export async function saveOnboarding(
  data: OnboardingData
): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") {
    return fail("Not authenticated");
  }

  try {
    const carrier = await prisma.carrierCompany.findUnique({
      where: {userId},
      select: {id: true},
    });

    if (!carrier) {
      return fail("Carrier company not found. Please contact support.");
    }

    await prisma.$transaction(async (tx) => {
      // Step 1: Truck registration
      const {truckType, plateNumber, loadCapacity, condition} = data.step1;
      if (truckType && plateNumber && loadCapacity) {
        const statusMap: Record<string, string> = {
          excellent: "AVAILABLE",
          good: "AVAILABLE",
          fair: "MAINTENANCE",
          needs_repair: "MAINTENANCE",
        };

        await tx.truck.upsert({
          where: {plateNumber},
          update: {
            truckType,
            loadCapacity: parseInt(loadCapacity, 10) || 0,
            status: (statusMap[condition] ?? "AVAILABLE") as "AVAILABLE" | "IN_USE" | "MAINTENANCE",
          },
          create: {
            carrierId: carrier.id,
            truckType,
            plateNumber,
            loadCapacity: parseInt(loadCapacity, 10) || 0,
            yearOfManufacture: new Date().getFullYear(),
            status: (statusMap[condition] ?? "AVAILABLE") as "AVAILABLE" | "IN_USE" | "MAINTENANCE",
          },
        });
      }

      // Step 2 + 3: Profile (route, availability, preferences)
      const {step2, step3} = data;
      await tx.carrierProfile.upsert({
        where: {carrierId: carrier.id},
        update: {
          baseCity: step2.baseCity || null,
          preferredRoutes: step2.preferredRoutes || null,
          availableDays: JSON.stringify(step2.availableDays),
          availableFrom: step2.availableFrom || null,
          availableTo: step2.availableTo || null,
          loadTypes: JSON.stringify(step2.loadTypes),
          preferredJobTypes: JSON.stringify(step3.preferredJobTypes),
          minPrice: parseInt(step3.minPrice, 10) || null,
          maxPrice: parseInt(step3.maxPrice, 10) || null,
          maxDistance: parseInt(step3.maxDistance, 10) || null,
          notifyMatchingJobs: step3.notifyMatchingJobs,
          showOutsidePrefs: step3.showOutsidePrefs,
          notifyWorkHoursOnly: step3.notifyWorkHoursOnly,
        },
        create: {
          carrierId: carrier.id,
          baseCity: step2.baseCity || null,
          preferredRoutes: step2.preferredRoutes || null,
          availableDays: JSON.stringify(step2.availableDays),
          availableFrom: step2.availableFrom || null,
          availableTo: step2.availableTo || null,
          loadTypes: JSON.stringify(step2.loadTypes),
          preferredJobTypes: JSON.stringify(step3.preferredJobTypes),
          minPrice: parseInt(step3.minPrice, 10) || null,
          maxPrice: parseInt(step3.maxPrice, 10) || null,
          maxDistance: parseInt(step3.maxDistance, 10) || null,
          notifyMatchingJobs: step3.notifyMatchingJobs,
          showOutsidePrefs: step3.showOutsidePrefs,
          notifyWorkHoursOnly: step3.notifyWorkHoursOnly,
        },
      });

      // Step 4: Documents
      const docEntries = [
        {type: "truck_registration", fileName: data.step4.truckRegistration},
        {type: "insurance", fileName: data.step4.insurance},
        {type: "roadworthiness", fileName: data.step4.roadworthiness},
        {type: "driver_license", fileName: data.step4.driverLicense},
        {type: "profile_photo", fileName: data.step4.profilePhoto},
      ].filter((d) => d.fileName);

      if (docEntries.length > 0) {
        await tx.carrierDocument.deleteMany({where: {carrierId: carrier.id}});
        await tx.carrierDocument.createMany({
          data: docEntries.map((d) => ({
            carrierId: carrier.id,
            type: d.type,
            fileName: d.fileName,
          })),
        });
      }

      // Step 4: Update driver license if provided
      if (data.step4.driverLicense) {
        await tx.driver.upsert({
          where: {userId},
          update: {licenseNumber: data.step4.driverLicense},
          create: {
            userId,
            carrierId: carrier.id,
            licenseNumber: data.step4.driverLicense,
          },
        });
      }

      // Mark onboarding complete
      await tx.user.update({
        where: {id: userId},
        data: {onboardingCompleted: true, onboardingStep: 5},
      });
    });

    revalidatePath("/dashboard/carrier");
    revalidatePath("/dashboard/carrier/profile");
    revalidatePath("/dashboard/carrier/my_truck");

    return ok("Onboarding completed successfully! Welcome aboard.");
  } catch (error) {
    console.error("Error saving onboarding:", error);
    return fail("Failed to save onboarding data. Please try again.");
  }
}

export async function updateOnboardingStep(
  step: number
): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || typeof userId !== "number") {
    return fail("Not authenticated");
  }

  await prisma.user.update({
    where: {id: userId},
    data: {onboardingStep: step},
  });

  return ok();
}
