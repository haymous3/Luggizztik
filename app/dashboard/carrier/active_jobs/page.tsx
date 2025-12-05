import FindLoads from "@/app/_components/FindLoads";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  return (
    <div>
      <FindLoads />
    </div>
  );
};

export default Page;
