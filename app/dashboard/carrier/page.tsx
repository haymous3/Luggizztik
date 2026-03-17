import CarrierOverview from "@/features/carrier/components/Carrieroveriew";
import {getCarrierRecentActivities, getCarrierStats} from "@/features/carrier/actions";
import {Metadata} from "next";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";
import {getOnboardingState} from "@/features/carrier/onboarding-actions";

export const metadata: Metadata = {
  title: "Carrier Dashboard",
};

type PageProps = {
  searchParams?: Promise<{[key: string]: string | string[] | undefined}>;
};

const Page = async ({searchParams}: PageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const [activities, stats, onboarding] = await Promise.all([
    getCarrierRecentActivities(),
    getCarrierStats(),
    getOnboardingState(),
  ]);

  const resolved = await searchParams;
  const status = Array.isArray(resolved?.status)
    ? resolved.status[0]
    : (resolved?.status ?? "all");

  return (
    <CarrierOverview
      activities={activities}
      stats={stats}
      status={status}
      onboardingCompleted={onboarding?.completed ?? false}
    />
  );
};

export default Page;
