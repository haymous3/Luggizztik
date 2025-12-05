import MyTruck from "@/app/_components/MyTruck";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  return <MyTruck />;
};

export default Page;
