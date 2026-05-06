import { redirect } from "next/navigation";
import DriverActiveDeliveryClient from "@/features/driver/components/DriverActiveDeliveryClient";
import { getDriverPortalDataFromSession } from "@/features/driver/actions";

export const metadata = {
  title: "Driver Active Delivery",
};

export default async function DriverActiveDeliveryPage() {
  const data = await getDriverPortalDataFromSession();
  if (!data) {
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <DriverActiveDeliveryClient data={data} />
    </main>
  );
}
