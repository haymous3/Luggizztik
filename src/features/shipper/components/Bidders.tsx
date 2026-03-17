"use client";

import useSWR from "swr";
import Bidder from "./Bidder";
import {getBidders} from "@/features/bids/actions";

type BidderType = {
  id: number;
  amount: number;
  createdAt: Date;
  userId: number;
  shipmentId: number;
  user: {
    id: number;
    name: string;
    phoneNumber: string;
  };
};

type BiddersProps = {
  id: number;
  onCloseModal?: () => void;
};

const fetcher = async (id: number) => {
  const data = await getBidders(id);
  return data as BidderType[];
};

export default function Bidders({id, onCloseModal}: BiddersProps) {
  const {
    data: bidders,
    error,
    isLoading,
  } = useSWR(id ? ["bidders", id] : null, ([, id]) => fetcher(id), {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-3">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Carriers Bidding
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a carrier to accept their bid for your shipment
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <svg
            className="animate-spin h-6 w-6 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-gray-400">Loading bidders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm text-red-500">
            Failed to load bidders. Please try again.
          </p>
        </div>
      ) : !bidders || bidders.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">No bidders yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Carriers will appear here once they place bids.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {bidders.length} bid{bidders.length !== 1 ? "s" : ""} received
          </p>
          {bidders.map((bidder) => (
            <Bidder key={bidder.id} bid={bidder} onCloseModal={onCloseModal} />
          ))}
        </div>
      )}
    </div>
  );
}
