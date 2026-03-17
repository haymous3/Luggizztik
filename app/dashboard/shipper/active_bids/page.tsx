import ActiveBids from "@/features/shipper/components/Activebid";
import prisma from "@/lib/prisma";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const shipments = await prisma.shipment.findMany({
    where: {
      shipperId: session.user.id,
      acceptedBidId: null,
    },
    select: {
      id: true,
      cargoType: true,
      pickupLocation: { select: { address: true } },
      deliveryLocation: { select: { address: true } },
      budgetMin: true,
      budgetMax: true,
      bids: { select: { id: true } },
    },
  });

  const parsedShipments = shipments.map((s) => ({
    id: s.id,
    cargoType: s.cargoType,
    pickupLocation: s.pickupLocation.address,
    deliveryLocation: s.deliveryLocation.address,
    budgetMin: s.budgetMin,
    budgetMax: s.budgetMax,
    bids: s.bids.map((b) => String(b.id)),
  }));

  return (
    <div>
      <ActiveBids shipments={parsedShipments} />
    </div>
  );
};

export default Page;
