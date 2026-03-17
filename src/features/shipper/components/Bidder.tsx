"use client";

import {useTransition} from "react";
import {toast} from "sonner";
import {selectBidder, declineBid} from "@/features/bids/actions";
import {formatDistanceToNow} from "date-fns";
import {UserCircleIcon, PhoneIcon} from "@heroicons/react/24/outline";

type BidderData = {
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

type BidderProps = {
  bid: BidderData;
  onCloseModal?: () => void;
};

const Bidder = ({bid, onCloseModal}: BidderProps) => {
  const [isAccepting, startAccept] = useTransition();
  const [isDeclining, startDecline] = useTransition();

  const isPending = isAccepting || isDeclining;

  const handleAccept = () => {
    startAccept(async () => {
      const res = await selectBidder(bid.shipmentId, bid.id);
      if (res.success) {
        toast.success(res.message ?? "Bid accepted!");
        onCloseModal?.();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDecline = () => {
    startDecline(async () => {
      const res = await declineBid(bid.shipmentId, bid.id);
      if (res.success) {
        toast.success(res.message ?? "Bid declined");
      } else {
        toast.error(res.message);
      }
    });
  };

  const timeAgo = formatDistanceToNow(new Date(bid.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-50">
          <UserCircleIcon className="w-6 h-6 text-blue-400" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {bid.user.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
            <PhoneIcon className="w-3 h-3" />
            <span>{bid.user.phoneNumber}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-base font-bold text-emerald-700">
            &#8358;{bid.amount.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">{timeAgo}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            disabled={isPending}
            className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            {isDeclining ? "..." : "Decline"}
          </button>
          <button
            onClick={handleAccept}
            disabled={isPending}
            className="px-3 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {isAccepting ? "..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bidder;
