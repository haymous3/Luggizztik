"use client";
import {Table} from "@/app/_components/Table";
import InputField from "./InputField";
import Button from "./Button";
import {createShipment} from "@/app/_lib/server/shipment/action";
import {useState} from "react";

const PostLoad = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Table.Root>
      <Table.Header>
        <h1 className="text-brand-1 font-bold text-lg">Post a New Load</h1>
        <p className="font-semibold">
          Fill in the details to get bids from verified carriers
        </p>
      </Table.Header>
      <Table.Body>
        <form
          className="bg-white rounded-sm px-10 py-7 mt-5"
          action={createShipment}
        >
          <div className="flex flex-wrap justify-between">
            <InputField
              label="Cargo Type"
              type="text"
              name="cargoType"
              width="w-[35rem]"
            />
            <InputField
              label="Weight"
              type="text"
              name="weight"
              width="w-[35rem]"
            /> 
          </div>
          <div className="flex flex-wrap justify-between">
            <InputField
              label="Pickup Location"
              type="text"
              name="pickupLocation"
              width="w-[35rem]"
            />
            <InputField
              label="Delivery Location"
              type="text"
              name="deliveryLocation"
              width="w-[35rem]"
            />
          </div>
          <div className="flex flex-wrap justify-between">
            <InputField
              label="Pickup Date"
              type="date"
              name="pickupDate"
              width="w-[35rem]"
            />
            <InputField
              label="Prefered Delivery Date"
              type="date"
              name="preferedDeliveryDate"
              width="w-[35rem]"
            />
          </div>

          <InputField
            label="Company Name"
            type="text"
            name="companyName"
            width="w-full"
          />
          <div className="flex flex-wrap justify-between">
            <div className="flex gap-4">
              <InputField
                label="Budget Range (From)"
                type="text"
                name="budgetRangeFrom"
                width="w-[10rem]"
              />
              <InputField
                label="Budget Range (To)"
                type="text"
                name="budgetRangeTo"
                width="w-[10rem]"
              />
            </div>

            <InputField
              label="Urgent"
              checked={checked}
              onChange={() => setChecked(!checked)}
              type="checkbox"
              value={checked ? "true" : "false"}
              name="urgent"
              width="w-[2rem]"
            />
          </div>
          <Button type="submit" pendingLabel="Posting...">
            Post Load & Get Bids
          </Button>
        </form>
      </Table.Body>
    </Table.Root>
  );
};

export default PostLoad;
