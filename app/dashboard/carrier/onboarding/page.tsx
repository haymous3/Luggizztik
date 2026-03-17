import Onboarding from "@/features/carrier/components/Onboarding";
import {auth} from "@/features/auth/auth";
import {redirect} from "next/navigation";
import {getTruckTypes} from "@/lib/truck-types";
import {getOnboardingState} from "@/features/carrier/onboarding-actions";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const [truckTypes, onboardingState] = await Promise.all([
    getTruckTypes(),
    getOnboardingState(),
  ]);

  return (
    <Onboarding
      truckTypes={truckTypes}
      initialStep={onboardingState?.currentStep ?? 0}
    />
  );
};

export default Page;
