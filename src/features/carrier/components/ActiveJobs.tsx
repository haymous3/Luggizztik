"use client";

import {useState, useTransition} from "react";
import {toast} from "sonner";
import {Table} from "@/components/ui/Table";
import {TruckIcon, UserCircleIcon, PhoneIcon} from "@heroicons/react/24/outline";
import {updateJobStatus} from "@/features/carrier/actions";

export type ActiveJob = {
  id: number;
  status: string;
  cargoType: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  bidAmount: number;
  shipperName: string;
  shipperPhone: string;
  createdAt: string;
};

type ActiveJobsProps = {
  jobs: ActiveJob[];
};

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

function statusLabel(status: string) {
  const map: Record<string, string> = {
    CREATED: "Assigned",
    DRIVER_ASSIGNED: "Driver Assigned",
    DRIVER_EN_ROUTE: "En Route",
    ARRIVED_PICKUP: "At Pickup",
    LOADING: "Loading",
    LOADED: "Loaded",
    IN_TRANSIT: "In Transit",
    ARRIVED_DESTINATION: "At Destination",
    UNLOADING: "Unloading",
    DELIVERED: "Delivered",
  };
  return map[status] ?? status;
}

function statusStyle(status: string) {
  if (status === "IN_TRANSIT" || status === "DRIVER_EN_ROUTE")
    return "bg-emerald-700 text-white";
  if (status === "LOADING" || status === "LOADED" || status === "UNLOADING")
    return "bg-gray-900 text-white";
  if (status === "DELIVERED")
    return "bg-blue-100 text-blue-800 border border-blue-200";
  if (status === "ARRIVED_PICKUP" || status === "ARRIVED_DESTINATION")
    return "bg-amber-100 text-amber-800 border border-amber-300";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

function nextStatusLabel(status: string) {
  const next = STATUS_FLOW[status];
  if (!next) return null;
  return statusLabel(next);
}

function JobCard({job}: {job: ActiveJob}) {
  const [showContact, setShowContact] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = () => {
    const next = STATUS_FLOW[job.status];
    if (!next) return;

    startTransition(async () => {
      const res = await updateJobStatus(job.id, next);
      if (res.success) {
        toast.success(res.message ?? "Status updated!");
      } else {
        toast.error(res.message);
      }
    });
  };

  const nextLabel = nextStatusLabel(job.status);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow px-5 py-5 ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Top: cargo info + price */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {job.cargoType}
            </h3>
            <p className="text-sm text-gray-500">
              {job.pickupLocation}
              <span className="mx-1.5 text-gray-300">&rarr;</span>
              {job.deliveryLocation}
            </p>
          </div>
        </div>
        <p className="text-base font-bold text-emerald-700 flex-shrink-0">
          &#8358;{job.bidAmount.toLocaleString()}
        </p>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-4 mt-4">
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(job.status)}`}
        >
          {statusLabel(job.status)}
        </span>
      </div>

      {/* Contact shipper reveal */}
      {showContact && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3">
          <PhoneIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-gray-800">{job.shipperName}</span>
            <span className="mx-2 text-gray-300">|</span>
            <a
              href={`tel:${job.shipperPhone}`}
              className="text-blue-600 font-medium hover:underline"
            >
              {job.shipperPhone}
            </a>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          View Route
        </button>

        {nextLabel && (
          <button
            onClick={handleUpdateStatus}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isPending ? "Updating..." : `Update Status`}
          </button>
        )}

        <button
          onClick={() => setShowContact((v) => !v)}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {showContact ? "Hide Contact" : "Contact Shipper"}
        </button>
      </div>

      {/* Next status hint */}
      {nextLabel && (
        <p className="text-[11px] text-gray-400 mt-2">
          Next step: <span className="font-medium">{nextLabel}</span>
        </p>
      )}
    </div>
  );
}

export default function ActiveJobs({jobs}: ActiveJobsProps) {
  return (
    <Table.Root>
      <Table.Header>
        <div>
          <h1 className="text-emerald-800 font-bold text-lg">Active Jobs</h1>
          <p className="text-sm text-gray-500">
            Monitor and manage your current deliveries
          </p>
        </div>
      </Table.Header>
      <Table.Body>
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
              <TruckIcon className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              No active jobs
            </h3>
            <p className="mt-1 text-sm text-gray-400 max-w-xs">
              When a shipper accepts your bid, the job will appear here.
            </p>
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </Table.Body>
    </Table.Root>
  );
}
