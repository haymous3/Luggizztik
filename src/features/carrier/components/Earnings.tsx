"use client";

import {UserCircleIcon, BanknotesIcon} from "@heroicons/react/24/outline";
import {format} from "date-fns";
import type {
  EarningsSummary,
  PaymentHistoryItem,
} from "@/features/carrier/actions";

type EarningsProps = {
  summary: EarningsSummary;
  history: PaymentHistoryItem[];
};

function formatNaira(amount: number) {
  return `\u20A6${amount.toLocaleString()}`;
}

const Earnings = ({summary, history}: EarningsProps) => {
  return (
    <div className="space-y-6 mt-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatNaira(summary.thisWeek)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">This Month</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatNaira(summary.thisMonth)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {formatNaira(summary.pending)}
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl shadow-sm py-6 px-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
            <BanknotesIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-emerald-800">
              Payment History
            </h1>
            <p className="text-sm text-gray-500">
              Track your earnings and payment status
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
                <BanknotesIcon className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">
                No earnings yet
              </h3>
              <p className="mt-1 text-sm text-gray-400 max-w-xs">
                When you complete jobs, your payment history will appear here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                    <UserCircleIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.cargoType}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.pickupLocation}
                      <span className="mx-1.5 text-gray-300">&rarr;</span>
                      {item.deliveryLocation}
                      <span className="mx-1.5 text-gray-300">&middot;</span>
                      <span className="text-gray-400">
                        {item.status === "paid" ? "Completed" : "In Progress"}
                      </span>
                    </p>
                    {item.completedAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(new Date(item.completedAt), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.status === "paid"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.status === "paid" ? "Paid" : "Pending"}
                    </span>
                    <p className="text-base font-bold text-emerald-700 mt-1">
                      {formatNaira(item.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
