import FindLoads from "@/features/carrier/components/FindLoads";
import prisma from "@/lib/prisma";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const userId = session.user.id;

  const shipments = await prisma.shipment.findMany({
    orderBy: {createdAt: "desc"},
    include: {
      bids: {select: {id: true, userId: true, amount: true, status: true}},
      pickupLocation: {select: {address: true}},
      deliveryLocation: {select: {address: true}},
      shipper: {select: {name: true, username: true, email: true}},
    },
  });

  const parsedShipments = shipments
    .filter((s) => {
      const myBid = s.bids.find((b) => b.userId === userId);
      return myBid?.status !== "ACCEPTED";
    })
    .map((s) => {
      const myBid = s.bids.find((b) => b.userId === userId);
      return {
        id: s.id,
        cargoType: s.cargoType,
        pickupLocation: s.pickupLocation.address,
        deliveryLocation: s.deliveryLocation.address,
        bids: s.bids.map((b) => String(b.id)),
        urgent: s.urgent,
        pickupDate: s.pickupDate.toISOString(),
        deliveryDate: s.deliveryDate.toISOString(),
        createdAt: s.createdAt.toISOString(),
        weight: s.weight,
        distance: s.distance ?? 0,
        shipperName: s.shipper.name || s.shipper.username || s.shipper.email,
        myBidAmount: myBid?.amount ?? null,
        myBidStatus: myBid?.status ?? null,
      };
    });

  return <FindLoads shipments={parsedShipments} />;
};

export default Page;
