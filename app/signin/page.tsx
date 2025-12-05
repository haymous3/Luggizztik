import type {Metadata} from "next";

import SignInForm from "../_components/SignInForm";
import {signInAction} from "../_lib/server/auth/actions";
import AuthLayout from "@/app/_components/AuthLayout";

export const metadata: Metadata = {
  title: "Signin",
};

export default function Page() {
  return (
    <AuthLayout heading="Sign in to your account" intro="Welcome Back">
      <SignInForm signInAction={signInAction} />
    </AuthLayout>
  );
}
