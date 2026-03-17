import OverviewTable from "@/components/ui/OverviewTable";
import Filter from "@/components/ui/Filter";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";
import {getShipperRecentActivities} from "@/features/shipment/actions";

type PageProps = {
  searchParams?: Promise<{[key: string]: string | string[] | undefined}>;
};

const Page = async ({searchParams}: PageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const activities = await getShipperRecentActivities();
  const resolved = await searchParams;
  const status = Array.isArray(resolved?.status)
    ? resolved.status[0]
    : (resolved?.status ?? "all");

  return (
    <div>
      <OverviewTable
        status={status}
        data={activities}
        emptyMessage="No shipments yet"
        emptyDescription="When you post loads, they will appear here. Go to Post Load to create your first shipment."
      >
        <div>
          <h1 className="text-brand-1 font-bold text-lg">My Shipments</h1>
          <p className="font-bold">View and manage all your shipments</p>
        </div>
        <Filter />
      </OverviewTable>
    </div>
  );
};

export default Page;
