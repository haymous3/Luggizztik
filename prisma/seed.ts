import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const truckTypes = [
  { name: "Flatbed", description: "Open flat trailer for oversized and heavy loads" },
  { name: "Lowboy (Lowbed)", description: "Low-deck trailer for tall and heavy machinery" },
  { name: "Extendable Trailer", description: "Adjustable-length trailer for long cargo" },
  { name: "Step Deck", description: "Two-level deck trailer for taller freight" },
  { name: "Multi-Axle Trailer", description: "Extra axles for distributing very heavy loads" },
  { name: "Tanker Truck", description: "Enclosed tank for liquid or gas transport" },
  { name: "Refrigerated Truck", description: "Temperature-controlled truck for perishable goods" },
];

async function main() {
  console.log("Seeding truck types...");

  for (const type of truckTypes) {
    await prisma.truckType.upsert({
      where: { name: type.name },
      update: { description: type.description },
      create: type,
    });
  }

  console.log(`Seeded ${truckTypes.length} truck types.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
