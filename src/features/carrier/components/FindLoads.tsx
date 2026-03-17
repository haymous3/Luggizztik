"use client";

import React from "react";
import MenusProvider from "@/components/ui/Menu";
import FindLoad from "./FindLoad";
import {Table} from "@/components/ui/Table";
import Filter from "@/components/ui/Filter";

export type LoadItem = {
  id: number;
  cargoType: string;
  pickupLocation: string;
  deliveryLocation: string;
  bids: string[];
  urgent: boolean;
  pickupDate: string;
  deliveryDate: string;
  createdAt: string;
  weight: number;
  distance: number;
  shipperName: string;
  myBidAmount: number | null;
  myBidStatus: string | null;
};

type FindLoadsProps = {
  shipments: LoadItem[];
};

const FindLoads = ({shipments}: FindLoadsProps) => {
  return (
    <MenusProvider>
      <Table.Root>
        <Table.Header>
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-gray-900 font-bold text-base sm:text-lg">
                Available Loads
              </h1>
              <p className="text-sm text-gray-500">
                Find loads that match your truck and route preferences
              </p>
            </div>
            <Filter />
          </div>
        </Table.Header>
        <Table.Body>
          {shipments.length === 0 ? (
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
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-1.5H5.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H12m-7.5 0V6.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v7.875"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800">
                No loads available
              </h3>
              <p className="mt-1 text-sm text-gray-400 max-w-xs">
                When shippers post loads, they will appear here for bidding.
              </p>
            </div>
          ) : (
            shipments.map((load) => (
              <FindLoad load={load} key={load.id} />
            ))
          )}
        </Table.Body>
      </Table.Root>
    </MenusProvider>
  );
};

export default FindLoads;
