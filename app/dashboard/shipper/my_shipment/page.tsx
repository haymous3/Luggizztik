import OverviewTable from "@/app/_components/OverviewTable";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

type PageProps = {
  searchParams?: {[key: string]: string | string[] | undefined};
};
const Page = async ({searchParams}: PageProps) => {
  const {status} = (await searchParams) ?? {};

  const filter = Array.isArray(status) ? status[0] : (status ?? "all");

  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div>
      <OverviewTable status={filter}>
        <div>
          <h1 className="text-brand-1 font-bold text-lg">Recent Activity</h1>
          <p className="font-bold">Your latest jobs and earnings</p>
        </div>
      </OverviewTable>
    </div>
  );
};

export default Page;
