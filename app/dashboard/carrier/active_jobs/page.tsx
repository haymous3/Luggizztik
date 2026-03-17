import ActiveJobs from "@/features/carrier/components/ActiveJobs";
import prisma from "@/lib/prisma";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const userId = session.user.id;

  const jobs = await prisma.job.findMany({
    where: {driverUserId: userId},
    orderBy: {updatedAt: "desc"},
    include: {
      shipment: {
        include: {
          pickupLocation: {select: {address: true}},
          deliveryLocation: {select: {address: true}},
          shipper: {select: {name: true, username: true, email: true, phoneNumber: true}},
        },
      },
      bid: {select: {amount: true}},
    },
  });

  const parsedJobs = jobs.map((j) => ({
    id: j.id,
    status: j.status,
    cargoType: j.shipment.cargoType,
    pickupLocation: j.shipment.pickupLocation.address,
    deliveryLocation: j.shipment.deliveryLocation.address,
    pickupDate: j.shipment.pickupDate.toISOString(),
    bidAmount: j.bid.amount,
    shipperName: j.shipment.shipper.name || j.shipment.shipper.username || j.shipment.shipper.email,
    shipperPhone: j.shipment.shipper.phoneNumber,
    createdAt: j.updatedAt.toISOString(),
  }));

  return <ActiveJobs jobs={parsedJobs} />;
};

export default Page;
