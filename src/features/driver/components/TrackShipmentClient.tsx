"use client";

import { useState, useTransition } from "react";
import { getTrackingByTrackingId, type DriverPortalData } from "@/features/driver/actions";

function statusText(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function TrackShipmentClient({ initialTrackingId = "" }: { initialTrackingId?: string }) {
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [result, setResult] = useState<DriverPortalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await getTrackingByTrackingId(trackingId);
      if (!res.success) {
        setResult(null);
        setError(res.message);
        return;
      }
      setError(null);
      setResult(res.data ?? null);
    });
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold text-brand-1">Track Shipment</h1>
      <p className="mt-1 text-sm text-gray-500">Enter your tracking ID to view live shipment progress.</p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
          placeholder="Enter Tracking ID"
          className="h-11 flex-1 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-1"
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-lg bg-brand-1 px-5 font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Checking..." : "Track"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {result ? (
        <div className="mt-5 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
          <p><span className="font-semibold">Tracking ID:</span> {result.trackingId}</p>
          <p><span className="font-semibold">Driver:</span> {result.driverName ?? "N/A"} ({result.driverPhone ?? "N/A"})</p>
          <p><span className="font-semibold">Truck:</span> {result.truckType} ({result.plateNumber})</p>
          <p><span className="font-semibold">From:</span> {result.pickupAddress}</p>
          <p><span className="font-semibold">To:</span> {result.deliveryAddress}</p>
          <p><span className="font-semibold">Status:</span> {statusText(result.currentStatus)}</p>
        </div>
      ) : null}
    </div>
  );
}
