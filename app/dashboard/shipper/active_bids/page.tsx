import ActiveBids from "@/app/_components/Activebid";
import prisma from "@/app/_lib/server/prisma";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const shipments = await prisma.shipment.findMany({
    where: {
      shipperId: session.user.id,
    },
    select: {
      id: true,
      cargoType: true,
      pickupLocation: true,
      deliveryLocation: true,
      budget: true,
      bids: true,
    },
  });

  const parsedShipments = shipments.map((s) => ({
    ...s,
    budget: s.budget as {from: string; to: string},
  }));

  return (
    <div>
      <ActiveBids shipments={parsedShipments} />
    </div>
  );
};

export default Page;
