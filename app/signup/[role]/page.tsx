import AuthLayout from "@/app/_components/AuthLayout";
import CarrierSignUpForm from "@/app/_components/CarrierSignUpForm";
import ShipperSignUpForm from "@/app/_components/ShipperSignUpForm";
import SwitchTabButton from "@/app/_components/SwitchTab";
import {signUpAction, signInAction} from "@/app/_lib/server/auth/actions";
import {Metadata} from "next";

export const metaData: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async ({
  params,
}: {
  params: {role: "shipper" | "carrier"};
}) => {
  const {role} = await params;

  return (
    <AuthLayout heading={`Sign Up ${role} account `} intro="">
      <SwitchTabButton
        options={[
          {
            href: "/signup/shipper",
            name: "I need to ship Cargo",
          },
          {
            href: "/signup/carrier",
            name: "I own a truck",
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
        />
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
