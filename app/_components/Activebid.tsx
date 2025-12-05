"use client";

import {Table} from "./Table";

type ActiveBidProps = {
  shipments: {
    id: number;
    cargoType: string;
    pickupLocation: string;
    deliveryLocation: string;
    budget: {from: string; to: string};
    bids: string[];
  }[];
};

const ActiveBids = ({shipments}: ActiveBidProps) => {
  return (
    <Table.Root>
      <Table.Header>
        <h1 className="text-brand-1 font-bold text-lg">Active Bids</h1>
        <p className="font-semibold">Manage bids on your posted loads</p>
      </Table.Header>
      <Table.Body>
        {shipments?.map((item, i) => (
          <Table.Row key={i} data={item} />
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ActiveBids;
