"use client";

import { useState, useTransition } from "react";
import { placeBid } from "@/app/_lib/server/bids/action";

export default function BidButton({ shipmentId }: { shipmentId: number | undefined }) {
  // const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitBid(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("shipmentId", String(shipmentId));
      formData.append("amount", amount);

      const res = await placeBid(formData);

      if (res.success) {
        alert(res);
        
      } else {
        alert(res);
      }
    });
  }

  return (
    <>
      {/* <button
        className="px-3 py-1 rounded-sm bg-[#1FE21F] text-white"
        onClick={() => setOpen(true)}
      >
        Place Bid
      </button> */}

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <form
            onSubmit={submitBid}
            className="bg-white p-6 rounded shadow w-80"
          >
            <h2 className="text-lg font-bold mb-3">Make bid</h2>

            <input
              type="number"
              className="border px-2 py-1 w-full"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                // onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                disabled={isPending}
                type="submit"
                className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-60"
              >
                {isPending ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </form>
        </div>
      
    </>
  );
}
