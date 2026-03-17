import Profile from "@/features/carrier/components/Profile";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";
import {getCarrierProfileData} from "@/features/carrier/actions";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const data = await getCarrierProfileData();

  if (!data) {
    redirect("/signin");
  }

  return <Profile data={data} />;
};

export default Page;
