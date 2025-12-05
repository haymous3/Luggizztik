"use client";

import Button from "./Button";
import InputField from "./InputField";
import type {AuthState} from "@/app/_lib/types/auth";

type SignUpFormProps = {
  signUpAction: (formData: FormData) => Promise<AuthState>;
  signInAction: (formData: FormData) => Promise<void>;
};

const CarrierSignUpForm = ({signUpAction, signInAction}: SignUpFormProps) => {
  async function handleSubmit(formData: FormData) {
    const res = await signUpAction(formData);

    if (res.success) {
      signInAction(formData);
    } else {
      alert(res.message);
    }
  }
  return (
    <form action={handleSubmit}>
      <div className="flex flex-wrap gap-3">
        <InputField
          label="FullName"
          type="text"
          name="fullName"
          width="w-[12rem]"
        />
        <InputField
          label="Phone Number"
          type="number"
          name="phoneNumber"
          width="w-[12rem]"
        />
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <InputField
          label="Email Address"
          type="email"
          name="emailAddress"
          width="w-[12rem]"
        />
        <InputField
          label="Driver's license Number"
          type="text"
          name="licenseNumber"
          width="w-[12rem]"
        />
      </div>
      <InputField
        label="Address"
        type="text"
        name="address"
        width="w-[31rem]"
      />

      <h2 className="font-bold mt-5">Truck Information.</h2>
      <div className="flex flex-wrap gap-3 mt-4">
        <InputField
          label="Truck Type"
          type="text"
          name="truckType"
          width="w-[12rem]"
        />
        <InputField
          label="Load Capacity (tons)"
          type="text"
          name="loadCapacity"
          width="w-[12rem]"
        />
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <InputField
          label=" Plate Number"
          type="text"
          name="plateNumber"
          width="w-[12rem]"
        />
        <InputField
          label="Year of Manufacture"
          type="text"
          name="yearOfManufacture"
          width="w-[12rem]"
        />
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <InputField
          label="Password"
          type="password"
          name="password"
          width="w-[12rem]"
        />
        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          width="w-[12rem]"
        />
      </div>

      <div className="flex flex-row-reverse justify-end mt-3">
        <label htmlFor="termsAndCondition">
          I agree to the <span className="text-brand-6">Terms of Service </span>
          and <span className="text-brand-6">Privacy Policy</span>
        </label>
        <input type="checkbox" id="termsAndCondition" />
      </div>

      <Button type="submit" pendingLabel="Creating...">
        Create a Carrier Account
      </Button>
    </form>
  );
};

export default CarrierSignUpForm;
