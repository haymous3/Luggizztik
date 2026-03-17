"use client";

import Filter from "@/components/ui/Filter";
import OverviewTable, {
  type OverviewTableRow,
} from "@/components/ui/OverviewTable";
import {TruckIcon, StarIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import type {CarrierStats} from "@/features/carrier/actions";
import Link from "next/link";

type CarrierOverviewProps = {
  activities: OverviewTableRow[];
  stats: CarrierStats;
  status?: string;
  onboardingCompleted?: boolean;
};

function formatNaira(amount: number) {
  if (amount >= 1_000_000) return `\u20A6${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `\u20A6${(amount / 1_000).toFixed(0)}K`;
  return `\u20A6${amount.toLocaleString()}`;
}

const CarrierOverview = ({
  activities,
  stats,
  status = "all",
  onboardingCompleted = false,
}: CarrierOverviewProps) => {
  return (
    <div className="space-y-6 mt-4">
      {!onboardingCompleted && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-amber-900 text-sm sm:text-base">
                Complete your profile for better job opportunities
              </h3>
              <p className="text-sm text-amber-700 hidden sm:block mt-0.5">
                Carriers with complete profiles get 3x more job matches. Set up your truck, routes, and preferences.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/carrier/onboarding"
            className="flex-shrink-0 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-center"
          >
            Complete Profile
          </Link>
        </div>
      )}
      {/* Top section: Active Jobs + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: Active Jobs + Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100">
                <TruckIcon className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stats.activeJobs}
              <span className="text-base sm:text-lg font-semibold text-gray-600 ml-2">
                Active Job{stats.activeJobs !== 1 ? "s" : ""}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                Month Earnings
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1 truncate">
                {formatNaira(stats.monthEarnings)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Completed</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {stats.completedJobs}
              </p>
            </div>
            <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Rating</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1 flex items-center gap-1">
                <StarIcon className="w-5 h-5 text-amber-400 fill-amber-400" />
                —
              </p>
            </div>
          </div>
        </div>

        {/* Right: Map placeholder */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-100 rounded-xl shadow-sm overflow-hidden flex items-center justify-center min-h-[200px]">
          <div className="text-center p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/80 mb-3">
              <svg
                className="h-7 w-7 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-emerald-700">
              Live Map Coming Soon
            </p>
            <p className="text-xs text-emerald-600/60 mt-1">
              Track your active routes in real time
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <OverviewTable
        status={status}
        data={activities}
        emptyMessage="No recent activity"
        emptyDescription="When you accept and run jobs, they will appear here. Go to Find Loads to discover available shipments."
      >
        <div>
          <h1 className="text-emerald-800 font-bold text-lg">
            Recent Activity
          </h1>
          <p className="text-sm text-gray-500">
            Your latest jobs and earnings
          </p>
        </div>
        <Filter />
      </OverviewTable>
    </div>
  );
};

export default CarrierOverview;
