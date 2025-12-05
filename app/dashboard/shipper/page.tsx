//import SwitchTabButton from "@/app/_components/SwitchTab";
//import OverViewBox from "@/app/_components/OverViewBox";
import OverviewTable from "@/app/_components/OverviewTable";
import DashboardOverview from "@/app/_components/DashboardOverview";
import {Metadata} from "next";
import Filter from "@/app/_components/Filter";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

export const metaData: Metadata = {
  title: "Shippers Dashboard",
};

type PageProps = {
  searchParams?: {[key: string]: string | string[] | undefined};
};

const Page = async ({searchParams}: PageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const {status} = (await searchParams) ?? {};

  const filter = Array.isArray(status) ? status[0] : (status ?? "all");
  return (
    <div>
      <DashboardOverview earnings="$2.4M" completed="156" rating="4.9">
        12 Active Shipments
      </DashboardOverview>
      <OverviewTable status={filter}>
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
