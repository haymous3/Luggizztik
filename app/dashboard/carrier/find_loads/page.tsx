import FindLoads from "@/app/_components/FindLoads";
import prisma from "@/app/_lib/server/prisma";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const shipments = await prisma.shipment.findMany();

  const parsedShipments = shipments.map((s) => ({
    id: s.id,
    cargoType: s.cargoType,
    pickupLocation: s.pickupLocation,
    deliveryLocation: s.deliveryLocation,
    budget: s.budget as {from: string; to: string},
    bids: s.bids ?? [],
    urgent: s.urgent ?? false,
    pickupDate: s.pickupDate.toISOString(), // ✅ convert Date → string
    weight: s.weight,
    distance: s.distance ?? 0, // ✅ ensure number
  }));

  return <FindLoads shipments={parsedShipments} />;
};

export default Page;
