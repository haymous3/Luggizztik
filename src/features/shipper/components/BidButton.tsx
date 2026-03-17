"use client";

import {useState, useTransition} from "react";
import {toast} from "sonner";
import {placeBid} from "@/features/bids/actions";
import {Button} from "@/components/ui/button-base";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type BidButtonProps = {
  shipmentId: number | undefined;
  onCloseModal?: () => void;
};

export default function BidButton({shipmentId, onCloseModal}: BidButtonProps) {
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  const formattedPreview = amount
    ? `\u20A6${Number(amount).toLocaleString()}`
    : "";

  function submitBid(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("shipmentId", String(shipmentId));
      formData.append("amount", amount);

      const res = await placeBid(formData);

      if (res.success) {
        toast.success(res.message ?? "Bid placed!");
        setAmount("");
        onCloseModal?.();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <form onSubmit={submitBid} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-3">
          <svg
            className="h-6 w-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Place Your Bid</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter the amount you&apos;d like to bid for this shipment
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bid-amount" className="text-sm font-medium text-gray-700">
          Bid Amount (&#8358;)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            &#8358;
          </span>
          <Input
            id="bid-amount"
            type="number"
            min={1}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="pl-8 text-lg font-semibold h-12"
          />
        </div>
        {formattedPreview && (
          <p className="text-xs text-gray-400 mt-1">
            {formattedPreview}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || !amount}
          className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Bid"
          )}
        </Button>
      </div>
    </form>
  );
}
