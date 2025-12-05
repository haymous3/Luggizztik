"use client";

import React from "react";
import MenusProvider from "@/app/_components/Menu";
import FindLoad from "./FindLoad";
import {Table} from "./Table";
import Filter from "./Filter";

type FindLoadsProps = {
  shipments: {
    id: number;
    cargoType: string;
    pickupLocation: string;
    deliveryLocation: string;
    budget: {from: string; to: string};
    bids: string[];
    urgent: boolean;
    pickupDate: string;
    weight: number;
    distance: number;
  }[];
};

const FindLoads = ({shipments}: FindLoadsProps) => {
  return (
    <MenusProvider>
      <Table.Root>
        <Table.Header>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-brand-1 font-bold text-lg">
                Available Loads
              </h1>
              <p className="font-semibold">
                Find loads that match your truck and route preferences
              </p>
            </div>
            <Filter />
          </div>
        </Table.Header>
        <Table.Body>
          {shipments.map((load, i) => (
            <FindLoad load={load} key={load.id ?? i} />
          ))}
        </Table.Body>
      </Table.Root>
    </MenusProvider>
  );
};

export default FindLoads;
