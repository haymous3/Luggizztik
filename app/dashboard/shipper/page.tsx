import DashboardOverview from "@/features/shipper/components/DashboardOverview";
import {getShipperRecentActivities, getShipperStats} from "@/features/shipment/actions";
import {Metadata} from "next";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: "Shippers Dashboard",
};

type PageProps = {
  searchParams?: Promise<{[key: string]: string | string[] | undefined}>;
};

const Page = async ({searchParams}: PageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const [activities, stats] = await Promise.all([
    getShipperRecentActivities(),
    getShipperStats(),
  ]);

  const resolved = await searchParams;
  const status = Array.isArray(resolved?.status)
    ? resolved.status[0]
    : (resolved?.status ?? "all");

  return <DashboardOverview activities={activities} stats={stats} status={status} />;
};

export default Page;
