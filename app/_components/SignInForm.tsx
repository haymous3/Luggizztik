"use client";

//import {signIn} from "next-auth/react";
// import {useState} from "react";
import InputField from "@/app/_components/InputField";
import Button from "@/app/_components/Button";

//import {AuthState} from "../_lib/types/auth";

type SignInFormProps = {
  signInAction: (formData: FormData) => Promise<void>;
};

export default function SignInForm({signInAction}: SignInFormProps) {
  return (
    <form action={signInAction} className="flex flex-col gap-4">
      <InputField label="User Name" type="text" name="username" width="" />
      <InputField label="Password" type="password" name="password" width="" />

      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
      <Button type="submit" pendingLabel="Signning In">
        Sign in
      </Button>
    </form>
  );
}
