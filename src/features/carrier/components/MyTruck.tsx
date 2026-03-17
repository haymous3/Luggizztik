"use client";

import {
  TruckIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

type TruckData = {
  id: number;
  truckType: string;
  loadCapacity: number;
  plateNumber: string;
  yearOfManufacture: number;
  status: string;
  totalJobs: number;
};

type MyTruckProps = {
  trucks: TruckData[];
  licenseNumber: string | null;
};

function statusStyle(status: string) {
  if (status === "AVAILABLE")
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (status === "IN_USE")
    return "bg-blue-100 text-blue-700 border border-blue-200";
  if (status === "MAINTENANCE")
    return "bg-amber-100 text-amber-700 border border-amber-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    AVAILABLE: "Available",
    IN_USE: "In Use",
    MAINTENANCE: "Maintenance",
  };
  return map[status] ?? status;
}

const documents = [
  {name: "Driver's License", key: "license"},
  {name: "Vehicle Registration", key: "registration"},
  {name: "Insurance Certificate", key: "insurance"},
  {name: "Road Worthiness", key: "roadworthiness"},
];

const MyTruck = ({trucks, licenseNumber}: MyTruckProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left: Truck Information */}
      <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
              <TruckIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-emerald-800">
                Truck Information
              </h1>
              <p className="text-sm text-gray-500">
                Manage your truck details and documents
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {trucks.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
                <TruckIcon className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">
                No trucks registered
              </h3>
              <p className="mt-1 text-sm text-gray-400 max-w-xs mx-auto">
                Your truck details will appear here once registered.
              </p>
            </div>
          ) : (
            trucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                          Truck Type
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {truck.truckType}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                          Capacity
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {truck.loadCapacity >= 1000
                            ? `${(truck.loadCapacity / 1000).toFixed(1)} tons`
                            : `${truck.loadCapacity} kg`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                          Plate Number
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {truck.plateNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                          Year
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {truck.yearOfManufacture}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(truck.status)}`}
                    >
                      {statusLabel(truck.status)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {truck.totalJobs} job{truck.totalJobs !== 1 ? "s" : ""}{" "}
                      completed
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          <button className="w-full py-3 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors">
            Update Truck Details
          </button>
        </div>
      </div>

      {/* Right: Documents */}
      <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-emerald-800">Documents</h1>
              <p className="text-sm text-gray-500">
                Upload and manage required documents
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {documents.map((doc) => {
              const isLicense = doc.key === "license";
              const hasLicense = isLicense && licenseNumber && licenseNumber !== "PENDING";

              return (
                <div
                  key={doc.key}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    {doc.key === "insurance" ? (
                      <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                    ) : doc.key === "roadworthiness" ? (
                      <WrenchScrewdriverIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {doc.name}
                    </span>
                  </div>
                  {hasLicense ? (
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                      Pending
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button className="w-full mt-4 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTruck;
