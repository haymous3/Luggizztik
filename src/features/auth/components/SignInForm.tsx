"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import InputField from "@/components/ui/InputField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";

type Role = "shipper" | "carrier";

export default function SignInForm() {
  const [role, setRole] = useState<Role>("shipper");
  const [pending, setPending] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const rawEmail =
      (fd.get("emailAddress") as string) || (fd.get("username") as string);
    const email = rawEmail?.trim()?.toLowerCase();
    const password = (fd.get("password") as string) ?? "";

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setPending(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
        setPending(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      {/* Role toggle */}
      <div className="rounded-xl bg-brand-5 p-1.5 border border-brand-4">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setRole("shipper")}
            className={`rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200 ${
              role === "shipper"
                ? "bg-white text-brand-1 shadow-sm ring-1 ring-brand-4"
                : "text-muted-foreground hover:text-brand-1 hover:bg-white/50"
            }`}
            suppressHydrationWarning
          >
            Shipper
          </button>
          <button
            type="button"
            onClick={() => setRole("carrier")}
            className={`rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200 ${
              role === "carrier"
                ? "bg-white text-brand-1 shadow-sm ring-1 ring-brand-4"
                : "text-muted-foreground hover:text-brand-1 hover:bg-white/50"
            }`}
            suppressHydrationWarning
          >
            Carrier
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            name="emailAddress"
            placeholder="you@company.com"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-brand-1 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              className="h-10 rounded-lg border-border focus-visible:ring-brand-1"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            className="h-4 w-4 rounded border-border text-brand-1 focus:ring-brand-1 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground">
            Remember me
          </span>
        </label>

        <Button
          type="submit"
          disabled={pending}
          pendingLabel="Signing in..."
          className="w-full h-11 rounded-lg bg-brand-1 hover:bg-brand-1/90 text-white font-semibold"
        >
          {pending ? "Signing in..." : `Sign in as ${role === "shipper" ? "Shipper" : "Carrier"}`}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground pt-2">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup/shipper"
          className="text-brand-1 font-semibold hover:underline"
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
}
