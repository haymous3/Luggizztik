import MyTruck from "@/features/carrier/components/MyTruck";
import prisma from "@/lib/prisma";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const userId = session.user.id;

  const carrier = await prisma.carrierCompany.findUnique({
    where: {userId},
    include: {
      trucks: {
        orderBy: {createdAt: "desc"},
        include: {
          _count: {select: {jobs: true}},
        },
      },
    },
  });

  const driver = await prisma.driver.findUnique({
    where: {userId},
    select: {licenseNumber: true},
  });

  const trucks = (carrier?.trucks ?? []).map((t) => ({
    id: t.id,
    truckType: t.truckType,
    loadCapacity: t.loadCapacity,
    plateNumber: t.plateNumber,
    yearOfManufacture: t.yearOfManufacture,
    status: t.status,
    totalJobs: t._count.jobs,
  }));

  return (
    <MyTruck
      trucks={trucks}
      licenseNumber={driver?.licenseNumber ?? null}
    />
  );
};

export default Page;
