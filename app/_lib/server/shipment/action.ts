"use server";

import prisma from "@/app/_lib/server/prisma";
import {auth} from "@/app/_lib/server/auth";
import {getDistanceMatrix} from "@/app/_lib/services/services";
export const createShipment = async (formData: FormData) => {
  try {
    const session = await auth();
    const shipperId = session?.user?.id;

    if (!shipperId) {
      throw new Error("Unauthorized: No shipper ID found in session");
    }

    const cargoType = formData.get("cargoType") as string;
    const weight = Number(formData.get("weight"));
    const pickupLocation = formData.get("pickupLocation") as string;
    const deliveryLocation = formData.get("deliveryLocation") as string;

    const pickupDate = new Date(formData.get("pickupDate") as string);

    const deliveryDate = new Date(
      (formData.get("deliveryDate") ??
        formData.get("preferedDeliveryDate")) as string
    );

    const additionalNote = formData.get("additionalNote") as string;
    const urgent = formData.get("urgent") === "on";

    const budgetRangeFrom = Number(formData.get("budgetRangeFrom"));
    const budgetRangeTo = Number(formData.get("budgetRangeTo"));

    const budget = {from: budgetRangeFrom, to: budgetRangeTo};

    // Distance calculation
    const distance = await getDistanceMatrix(pickupLocation, deliveryLocation);

    // Create shipment
    await prisma.shipment.create({
      data: {
        cargoType,
        weight,
        pickupLocation,
        deliveryLocation,
        pickupDate,
        deliveryDate,
        additionalNote,
        urgent,
        budget,
        distance,
        shipper: {
          connect: {id: shipperId},
        },
      },
    });
  } catch (error: unknown) {
   // console.error("Error creating shipment:", error);
    console.log("Error creating shipment:", error);
    throw new Error("Internal server error while creating shipment");
  }
};
