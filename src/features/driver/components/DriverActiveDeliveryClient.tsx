"use client";

import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { updateDriverPortalStatus, type DriverPortalData } from "@/features/driver/actions";

const STATUS_FLOW: Record<string, string> = {
  CREATED: "DRIVER_EN_ROUTE",
  DRIVER_ASSIGNED: "DRIVER_EN_ROUTE",
  DRIVER_EN_ROUTE: "ARRIVED_PICKUP",
  ARRIVED_PICKUP: "LOADING",
  LOADING: "LOADED",
  LOADED: "IN_TRANSIT",
  IN_TRANSIT: "ARRIVED_DESTINATION",
  ARRIVED_DESTINATION: "UNLOADING",
  UNLOADING: "DELIVERED",
};

const CHECKLIST = [
  { status: "DRIVER_EN_ROUTE", label: "Heading to pickup location" },
  { status: "ARRIVED_PICKUP", label: "Arrived at pickup location" },
  { status: "LOADING", label: "Loading cargo" },
  { status: "LOADED", label: "Cargo loaded" },
  { status: "IN_TRANSIT", label: "In transit to destination" },
  { status: "ARRIVED_DESTINATION", label: "Arrived at destination" },
  { status: "UNLOADING", label: "Unloading cargo" },
  { status: "DELIVERED", label: "Delivery completed" },
];

function statusLabel(status: string): string {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function DriverActiveDeliveryClient({ data }: { data: DriverPortalData }) {
  const [isPending, startTransition] = useTransition();

  const currentIndex = useMemo(
    () => CHECKLIST.findIndex((item) => item.status === data.currentStatus),
    [data.currentStatus]
  );

  const nextStatus = STATUS_FLOW[data.currentStatus];

  const onAdvance = () => {
    if (!nextStatus) return;
    startTransition(async () => {
      const res = await updateDriverPortalStatus(nextStatus);
      if (res.success) {
        toast.success(res.message ?? "Progress updated");
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h1 className="text-xl font-bold text-brand-1">Active Delivery</h1>
      <p className="mt-1 text-sm text-gray-500">Update your delivery milestones as you complete each step.</p>

      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm">
        <p><span className="font-semibold">Tracking ID:</span> {data.trackingId ?? "Pending"}</p>
        <p><span className="font-semibold">Pickup:</span> {data.pickupAddress}</p>
        <p><span className="font-semibold">Destination:</span> {data.deliveryAddress}</p>
        <p><span className="font-semibold">Truck:</span> {data.truckType} ({data.plateNumber})</p>
      </div>

      <div className="mt-5 space-y-2">
        {CHECKLIST.map((item, index) => {
          const done = currentIndex >= index || data.currentStatus === item.status;
          return (
            <div key={item.status} className="flex items-center gap-3 rounded-md border border-gray-100 p-2">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded border text-xs ${
                  done ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={done ? "text-gray-900" : "text-gray-500"}>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <p className="text-sm text-gray-500">
          Current status: <span className="font-semibold text-gray-800">{statusLabel(data.currentStatus)}</span>
        </p>
        <button
          type="button"
          disabled={isPending || !nextStatus}
          onClick={onAdvance}
          className="mt-3 w-full rounded-lg bg-brand-2 px-4 py-2.5 font-semibold text-brand-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Updating..." : nextStatus ? "Mark task as completed" : "Delivery completed"}
        </button>
      </div>
    </div>
  );
}
