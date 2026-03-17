import PostLoad from "@/features/shipper/components/PostLoad";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";
import {getTruckTypes} from "@/lib/truck-types";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const truckTypes = await getTruckTypes();

  return <PostLoad truckTypes={truckTypes} />;
};

export default Page;
