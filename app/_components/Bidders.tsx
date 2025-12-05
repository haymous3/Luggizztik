"use client";
import useSWR from "swr";
import Bidder from "@/app/_components/Bidder";
import {getBidders} from "../_lib/server/bids/action";

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
};

// SWR fetcher
const fetcher = async (id: number) => {
  const data = await getBidders(id);
  return data as BidderType[];
};

export default function Bidders({id}: BiddersProps) {
  // poll every 5 seconds (5000 ms)
  const {
    data: bidders,
    error,
    isLoading,
  } = useSWR(id ? ["bidders", id] : null, ([, id]) => fetcher(id), {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  if (isLoading) return <p>Loading bidders...</p>;
  if (error) return <p>Failed to load bidders</p>;
  if (!bidders || bidders.length === 0) return <p>No bidders yet.</p>;

  return (
    <div>
      <h2>Carriers bidding for your shipment</h2>
      <ul>
        {bidders.map((bidder) => (
          <Bidder key={bidder.id} bid={bidder} />
        ))}
      </ul>
    </div>
  );
}
