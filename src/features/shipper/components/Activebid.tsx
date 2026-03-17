"use client";

import {Table} from "@/components/ui/Table";

type ActiveBidProps = {
  shipments: {
    id: number;
    cargoType: string;
    pickupLocation: string;
    deliveryLocation: string;
    budgetMin: number;
    budgetMax: number;
    bids: string[];
  }[];
};

const ActiveBids = ({shipments}: ActiveBidProps) => {
  const rows = shipments.map((s) => ({
    id: s.id,
    cargoType: s.cargoType,
    pickupLocation: s.pickupLocation,
    deliveryLocation: s.deliveryLocation,
    price: `${s.budgetMin} - ${s.budgetMax}`,
    bids: s.bids,
  }));

  return (
    <Table.Root>
      <Table.Header>
        <h1 className="text-brand-1 font-bold text-lg">Active Bids</h1>
        <p className="font-semibold text-gray-500">
          Manage bids on your posted loads
        </p>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
              <svg
                className="h-7 w-7 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              No active bids
            </h3>
            <p className="mt-1 text-sm text-gray-400 max-w-xs">
              When carriers place bids on your shipments, they will appear here
              for you to review and accept.
            </p>
          </div>
        ) : (
          rows.map((item) => (
            <Table.Row key={item.id} data={item} />
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default ActiveBids;
