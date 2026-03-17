import type {Metadata} from "next";

import SignInForm from "@/features/auth/components/SignInForm";
import AuthLayout from "@/features/auth/components/AuthLayout";

export const metadata: Metadata = {
  title: "Signin",
};

export default function Page() {
  return (
    <AuthLayout heading="Sign in to your account" intro="Welcome Back">
      <SignInForm />
    </AuthLayout>
  );
}
