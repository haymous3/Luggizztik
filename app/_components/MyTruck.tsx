"use client";

import {Table} from "./Table";

const MyTruck = () => {
  return (
    <div className="flex justify-between mt-5">
      <Table.Root width="45%">
        <Table.Header>
          <h1 className="text-brand-1 font-bold text-lg">Truck Information</h1>
          <p className="font-semibold">
            Manage your truck details and documents
          </p>
        </Table.Header>
        <Table.Body>
          <div className="bg-white px-5 py-4 rounded-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[#9F9898]">Truck Type</h3>
                <p className="font-semibold">Flatbed</p>
              </div>
              <div className="text-center">
                <h3 className="text-[#9F9898]">Load Capacity</h3>
                <p className="font-semibold">50 tons</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-5">
              <h3 className="text-[#9F9898]">Insurance Status</h3>
              <p className="bg-[#333] text-brand-6 px-2 py-1 rounded-sm font-semibold">
                Active
              </p>
            </div>
            <div className="text-center mt-4">
              <button className="bg-[#A6E3CC] px-12 py-3 rounded-sm">
                Update Truck Details
              </button>
            </div>
          </div>
        </Table.Body>
      </Table.Root>
      <Table.Root width="45%">
        <Table.Header>
          <h1 className="text-brand-1 font-bold text-lg">Documents</h1>
          <p className="font-semibold">Upload and manage required documents</p>
        </Table.Header>
        <Table.Body>
          <div className="bg-white px-5 py-4 rounded-sm leading-5">
            <div className="flex justify-between mt-4">
              <h3>Driver License</h3>
              <h3 className="bg-[#333] text-brand-6 px-2 py-1 rounded-sm font-semibold">
                Verified
              </h3>
            </div>
            <div className="flex justify-between mt-4">
              <h3>Vehicle Registration</h3>
              <h3 className="bg-[#333] text-brand-6 px-2 py-1 rounded-sm font-semibold">
                Verified
              </h3>
            </div>
            <div className="flex justify-between mt-4">
              <h3>Insurance Certificate</h3>
              <h3 className="bg-[#333] text-brand-6 px-2 py-1 rounded-sm font-semibold">
                Verified
              </h3>
            </div>
            <div className="flex justify-between mt-4">
              <h3>Road Worthiness</h3>
              <h3 className="bg-[#333] text-brand-6 px-2 py-1 rounded-sm font-semibold">
                Verified
              </h3>
            </div>
            <div className="text-center mt-4">
              <button className="border-[#888888]">Upload Document</button>
            </div>
          </div>
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default MyTruck;
