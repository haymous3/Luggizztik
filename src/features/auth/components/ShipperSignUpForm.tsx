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
    <form action={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div className="space-y-5">
          <InputField
            label="Company Name"
            type="text"
            name="companyName"
            placeholder="Your Company LTD"
          />
          <InputField
            label="Email Address"
            type="email"
            name="emailAddress"
            placeholder="Your@company.com"
          />
          <InputField
            label="Business Address"
            type="text"
            name="address"
            placeholder="123 Business Street, Lagos, Nigeria"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
          />
        </div>
        <div className="space-y-5">
          <InputField
            label="Contact Person"
            type="text"
            name="username"
            placeholder="Your Name"
          />
          <InputField
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            placeholder="+234 800 000 0000"
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your Password"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 mt-4">
        <input
          type="checkbox"
          id="termsAndCondition"
          name="termsAccepted"
          className="mt-1 h-4 w-4 rounded border-border"
        />
        <label htmlFor="termsAndCondition" className="text-sm text-muted-foreground">
          I agree to the{" "}
          <Link href="/terms" className="text-brand-1 font-medium hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand-1 font-medium hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button type="submit" pendingLabel="Creating..." className="w-full">
        Create a shipper account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="text-brand-1 font-medium hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  );
};

export default ShipperSignUpForm;
