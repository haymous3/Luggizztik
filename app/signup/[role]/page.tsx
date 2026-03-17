import AuthLayout from "@/features/auth/components/AuthLayout";
import CarrierSignUpForm from "@/features/auth/components/CarrierSignUpForm";
import ShipperSignUpForm from "@/features/auth/components/ShipperSignUpForm";
import SwitchTabButton from "@/components/ui/SwitchTab";
import {signUpAction, signInAction} from "@/features/auth/actions";
import {getTruckTypes} from "@/lib/truck-types";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async ({
  params,
}: {
  params: Promise<{role: "shipper" | "carrier"}>;
}) => {
  const {role} = await params;
  const truckTypes = role === "carrier" ? await getTruckTypes() : [];

  return (
    <AuthLayout
      heading="Choose your account type to get started"
      intro="Join Luggiztik"
    >
      <SwitchTabButton
        options={[
          {
            href: "/signup/shipper",
            name: "I need to ship cargo",
          },
          {
            href: "/signup/carrier",
            name: "I own trucks",
          },
        ]}
      />

      {role === "shipper" ? (
        <ShipperSignUpForm
          signUpAction={signUpAction}
          signInAction={signInAction}
        />
      ) : (
        <CarrierSignUpForm
          signUpAction={signUpAction}
          signInAction={signInAction}
          truckTypes={truckTypes}
        />
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
