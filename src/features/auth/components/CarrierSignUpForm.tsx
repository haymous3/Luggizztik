"use client";

import Link from "next/link";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import type { ActionResult } from "@/lib/action-result";

type TruckTypeOption = { id: number; name: string };

type SignUpFormProps = {
  signUpAction: (formData: FormData) => Promise<ActionResult>;
  signInAction: (formData: FormData) => Promise<ActionResult | void>;
  truckTypes: TruckTypeOption[];
};

const CarrierSignUpForm = ({ signUpAction, signInAction, truckTypes }: SignUpFormProps) => {
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
      {/* Personal / Company row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <InputField
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="e.g. John Doe"
          required
        />
        <InputField
          label="Company Name"
          type="text"
          name="companyName"
          placeholder="e.g. Swift Logistics Ltd"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <InputField
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          placeholder="+234 800 000 0000"
          required
        />
        <InputField
          label="Email Address"
          type="email"
          name="emailAddress"
          placeholder="John@email.com"
          required
        />
      </div>

      {/* Identification */}
      <InputField
        label="Driver's License Number"
        type="text"
        name="licenseNumber"
        placeholder="ABC123456789"
      />

      {/* Address - full width */}
      <InputField
        label="Address"
        type="text"
        name="address"
        placeholder="123 Business Street, Lagos, Nigeria"
      />

      {/* Truck Information section */}
      <h2 className="font-semibold text-foreground pt-2">Truck Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <SelectField
          label="Truck Type"
          name="truckType"
          options={truckTypes.map((t) => ({ value: t.name, label: t.name }))}
          placeholder="Select truck type"
        />
        <InputField
          label="Load Capacity (tons)"
          type="text"
          name="loadCapacity"
          placeholder="e.g., 20"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <InputField
          label="Plate Number"
          type="text"
          name="plateNumber"
          placeholder="ABC-123-XY"
        />
        <InputField
          label="Year of Manufacture"
          type="text"
          name="yearOfManufacture"
          placeholder="2020"
        />
      </div>

      {/* Account security */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
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
          placeholder="Confirm your Password"
        />
      </div>

      {/* Terms and Privacy */}
      <div className="flex items-start gap-3 mt-4">
        <input
          type="checkbox"
          id="termsAndConditionCarrier"
          name="termsAccepted"
          className="mt-1 h-4 w-4 rounded border-border"
        />
        <label
          htmlFor="termsAndConditionCarrier"
          className="text-sm text-muted-foreground"
        >
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
        Create a Carrier account
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

export default CarrierSignUpForm;
