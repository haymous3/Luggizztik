"use client";

import React from "react";
import ModalProvider from "@/components/ui/Modal";
import {Menu as MenusMenu} from "@/components/ui/Menu";
import {
  MapPinIcon,
  UserCircleIcon,
  ScaleIcon,
  TruckIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {formatDistanceToNow, format} from "date-fns";
import {usePathname} from "next/navigation";
import BidButton from "@/features/shipper/components/BidButton";
import type {LoadItem} from "./FindLoads";

function formatWeight(kg: number) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`;
  return `${kg} kg`;
}

function formatDistance(km: number) {
  if (!km) return "N/A";
  return `${km.toLocaleString()} km`;
}

const FindLoad = ({load}: {load: LoadItem}) => {
  const {
    id,
    cargoType,
    pickupLocation,
    deliveryLocation,
    urgent,
    weight,
    distance,
    pickupDate,
    deliveryDate,
    createdAt,
    shipperName,
    myBidAmount,
    myBidStatus,
  } = load;

  const hasBid = myBidAmount !== null;
  const bidAccepted = myBidStatus === "ACCEPTED";
  const bidDeclined = myBidStatus === "REJECTED";

  const pathName = usePathname();
  const isActiveJobs = pathName === "/dashboard/carrier/active_jobs";

  return (
    <ModalProvider>
      <MenusMenu>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow px-5 py-5">
          {/* Top row: shipper info + urgent badge */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                <UserCircleIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {cargoType}
                </h3>
                <p className="text-sm text-gray-500">
                  {pickupLocation}
                  <span className="mx-1.5 text-gray-300">&rarr;</span>
                  {deliveryLocation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {urgent && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Urgent
                </span>
              )}
              <span className="text-xs text-gray-400">
                by {shipperName}
              </span>
            </div>
          </div>

          {/* Stats row */}
          {!isActiveJobs && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ScaleIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                    Weight
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatWeight(weight)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                    Distance
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDistance(distance)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                    Delivery Date
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {deliveryDate
                      ? format(new Date(deliveryDate), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                    Pickup Date
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {format(new Date(pickupDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom row: posted time + actions */}
          <div className="flex justify-between items-center mt-4">
            {!isActiveJobs && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>
                  Posted{" "}
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {!isActiveJobs ? (
                <>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  {bidAccepted ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <svg
                        className="w-4 h-4 text-emerald-600 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-emerald-700">
                        Bid accepted &middot; &#8358;{myBidAmount!.toLocaleString()}
                      </span>
                    </div>
                  ) : bidDeclined ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200">
                      <svg
                        className="w-4 h-4 text-red-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-red-600">
                        Bid declined
                      </span>
                    </div>
                  ) : hasBid ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
                      <svg
                        className="w-4 h-4 text-amber-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-amber-700">
                        Bid placed &middot; &#8358;{myBidAmount!.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <ModalProvider.Open opens="bids">
                      <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
                        Place Bid
                      </button>
                    </ModalProvider.Open>
                  )}
                </>
              ) : (
                <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  View Route
                </button>
              )}
            </div>
          </div>
        </div>

        <ModalProvider.Window name="bids">
          <BidButton shipmentId={id} />
        </ModalProvider.Window>
      </MenusMenu>
    </ModalProvider>
  );
};

export default FindLoad;
