"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import InputField from "@/components/ui/InputField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";
import type { ActionResult } from "@/lib/action-result";

type SignInFormProps = {
  signInAction: (formData: FormData) => Promise<ActionResult | void>;
};

type Role = "shipper" | "carrier";

export default function SignInForm({ signInAction }: SignInFormProps) {
  const [role, setRole] = useState<Role>("shipper");

  async function handleSubmit(formData: FormData) {
    const res = await signInAction(formData);

    if (res && !res.success) {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-5">
      <nav className="mt-2">
        <ul className="bg-[#f4f4f4] flex p-1 rounded-lg border border-border">
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setRole("shipper")}
              className={`block w-full py-2.5 rounded-md px-5 text-center text-sm font-semibold transition-colors ${
                role === "shipper"
                  ? "bg-white text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              suppressHydrationWarning
            >
              Shipper
            </button>
          </li>
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setRole("carrier")}
              className={`block w-full py-2.5 rounded-md px-5 text-center text-sm font-semibold transition-colors ${
                role === "carrier"
                  ? "bg-white text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              suppressHydrationWarning
            >
              Carrier
            </button>
          </li>
        </ul>
      </nav>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <InputField
          label="Email Address"
          type="email"
          name="emailAddress"
          placeholder="Your@email.com"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-destructive font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Your Password"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="rememberMe" className="text-sm text-foreground">
            Remember me
          </label>
        </div>

        <Button type="submit" pendingLabel="Signing in..." className="w-full">
          Sign in as {role === "shipper" ? "Shipper" : "Carrier"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground pt-1">
        Don&apos;t have an account?{" "}
        <Link href="/signup/shipper" className="text-brand-1 font-medium hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
