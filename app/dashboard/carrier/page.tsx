import CarrierOverview from "@/app/_components/Carrieroveriew";
import {Metadata} from "next";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

export const metaData: Metadata = {
  title: "Carrier Dashboard",
};

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  console.log(session);
  return <CarrierOverview />;
};

export default Page;
