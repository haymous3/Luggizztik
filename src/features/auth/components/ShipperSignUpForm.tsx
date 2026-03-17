"use client";

import Link from "next/link";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import type { ActionResult } from "@/lib/action-result";

type SignUpFormProps = {
  signUpAction: (formData: FormData) => Promise<ActionResult>;
  signInAction: (formData: FormData) => Promise<ActionResult | void>;
};

const ShipperSignUpForm = ({ signUpAction, signInAction }: SignUpFormProps) => {
  async function handleSubmit(formData: FormData) {
    const res = await signUpAction(formData);
    if (res.success) {
      toast.success(res.message ?? "Account created!");
      signInAction(formData);
    } else {
      toast.error(res.message);
    }
  }
  
  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="role" value="shipper" />
      <div className="rounded-xl border border-border bg-brand-5/30 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-brand-1 uppercase tracking-wide">
          Company & contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Company Name"
            type="text"
            name="companyName"
            placeholder="Your Company LTD"
          />
          <InputField
            label="Contact Person"
            type="text"
            name="username"
            placeholder="Your Name"
          />
          <InputField
            label="Email Address"
            type="email"
            name="emailAddress"
            placeholder="you@company.com"
          />
          <InputField
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            placeholder="+234 800 000 0000"
          />
          <div className="sm:col-span-2">
            <InputField
              label="Business Address"
              type="text"
              name="address"
              placeholder="123 Business Street, Lagos, Nigeria"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-brand-5/30 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-brand-1 uppercase tracking-wide">
          Account security
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer group rounded-lg p-4 border border-border bg-white hover:bg-brand-5/20 transition-colors">
        <input
          type="checkbox"
          id="termsAndCondition"
          name="termsAccepted"
          className="mt-0.5 h-4 w-4 rounded border-border text-brand-1 focus:ring-brand-1 focus:ring-offset-0 cursor-pointer"
        />
        <span className="text-sm text-muted-foreground group-hover:text-foreground">
          I agree to the{" "}
          <Link href="/terms" className="text-brand-1 font-medium hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand-1 font-medium hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        pendingLabel="Creating account..."
        className="w-full h-11 rounded-lg bg-brand-1 hover:bg-brand-1/90 text-white font-semibold"
      >
        Create shipper account
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-1">
        Already have an account?{" "}
        <Link href="/signin" className="text-brand-1 font-semibold hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  );
};

export default ShipperSignUpForm;
