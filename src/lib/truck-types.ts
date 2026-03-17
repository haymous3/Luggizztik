import prisma from "@/lib/prisma";

export async function getTruckTypes() {
  return prisma.truckType.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
