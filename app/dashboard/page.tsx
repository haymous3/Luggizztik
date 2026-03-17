import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.role) {
    redirect("/signin");
  }

  switch (session.user.role) {
    case "shipper":
      redirect("/dashboard/shipper");
    case "carrier":
      redirect("/dashboard/carrier");
    default:
      redirect("/");
  }
}
