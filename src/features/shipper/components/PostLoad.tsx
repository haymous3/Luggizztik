"use client";

import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import Button from "@/components/ui/Button";
import {createShipment} from "@/features/shipment/actions";
import {useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {CubeIcon} from "@heroicons/react/24/outline";

type TruckTypeOption = {id: number; name: string};

type PostLoadProps = {
  truckTypes: TruckTypeOption[];
};

const PostLoad = ({truckTypes}: PostLoadProps) => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const res = await createShipment(formData);
    if (res.success) {
      toast.success(res.message ?? "Shipment posted!");
      router.push("/dashboard/shipper/my_shipment");
    } else {
      toast.error(res.message);
    }
  }

  const truckTypeOptions = truckTypes.map((t) => ({
    value: t.name,
    label: t.name,
  }));

  return (
    <div className="mt-4 sm:mt-6">
      <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
              <CubeIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Post a New Load
              </h1>
              <p className="text-sm text-gray-500">
                Fill in the details to get bids from verified carriers
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8" action={handleSubmit}>
          {/* Section: Cargo Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Cargo Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <SelectField
                label="Cargo Type"
                name="cargoType"
                options={truckTypeOptions}
                placeholder="Select cargo type"
              />
              <InputField
                label="Weight (kg)"
                type="number"
                name="weight"
                placeholder="e.g. 5000"
                required
              />
            </div>
          </div>

          {/* Section: Route */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm mt-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Route Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <InputField
                label="Pickup Location"
                type="text"
                name="pickupLocation"
                placeholder="e.g. Lagos, Nigeria"
                required
              />
              <InputField
                label="Delivery Location"
                type="text"
                name="deliveryLocation"
                placeholder="e.g. Abuja, Nigeria"
                required
              />
            </div>
          </div>

          {/* Section: Schedule */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm mt-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Schedule
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <InputField
                label="Pickup Date"
                type="date"
                name="pickupDate"
                required
              />
              <InputField
                label="Preferred Delivery Date"
                type="date"
                name="preferedDeliveryDate"
                required
              />
            </div>
          </div>

          {/* Section: Budget & Preferences */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm mt-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Budget & Preferences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Budget Min (₦)"
                  type="number"
                  name="budgetRangeFrom"
                  placeholder="e.g. 50000"
                  required
                />
                <InputField
                  label="Budget Max (₦)"
                  type="number"
                  name="budgetRangeTo"
                  placeholder="e.g. 150000"
                  required
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer select-none mt-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                      value={checked ? "true" : "false"}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-red-500 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Urgent Delivery
                    </span>
                    <p className="text-xs text-gray-400">
                      Mark as urgent to attract faster bids
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-2">
              <InputField
                label="Additional Notes"
                type="text"
                name="additionalNote"
                placeholder="Any special instructions or requirements..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6">
            <Button
              type="submit"
              pendingLabel="Posting..."
              className="w-full sm:w-auto px-8"
            >
              Post Load & Get Bids
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostLoad;
