import PostLoad from "@/app/_components/PostLoad";
import {auth} from "@/app/_lib/server/auth";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  return <PostLoad />;
};

export default Page;
