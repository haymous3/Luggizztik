import Earnings from "@/features/carrier/components/Earnings";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";
import {getCarrierEarnings} from "@/features/carrier/actions";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const {summary, history} = await getCarrierEarnings();

  return <Earnings summary={summary} history={history} />;
};

export default Page;
