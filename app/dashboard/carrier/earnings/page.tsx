import Earnings from "@/app/_components/Earnings";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  return <Earnings />;
};

export default Page;
