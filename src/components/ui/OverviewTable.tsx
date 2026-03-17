"use client";

import { Table } from "./Table";

export type OverviewTableRow = {
  id: number;
  name?: string;
  cargoType?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  from?: string;
  to?: string;
  driver?: string;
  status?: string;
  eta?: string;
  price?: string;
  bids?: string[];
};

type OverviewTableProps = {
  status: string;
  children: React.ReactNode;
  data?: OverviewTableRow[];
  emptyMessage?: string;
  emptyDescription?: string;
};

function filterByStatus(
  items: OverviewTableRow[],
  status: string
): OverviewTableRow[] {
  if (!status || status === "all") return items;
  if (status === "transit") {
    return items.filter((item) => item.status?.toLowerCase() === "transit");
  }
  if (status === "pending") {
    return items.filter(
      (item) => item.status?.toLowerCase() === "pickup pending"
    );
  }
  if (status === "delivered") {
    return items.filter((item) => item.status?.toLowerCase() === "delivered");
  }
  return items;
}

export default function OverviewTable({
  status,
  children,
  data = [],
  emptyMessage = "No recent activity",
  emptyDescription = "When you have jobs or shipments, they will appear here.",
}: OverviewTableProps) {
  const displayed = filterByStatus(data, status);

  return (
    <Table.Root>
      <Table.Header>
        <div className="flex flex-wrap justify-between items-center gap-4">
          {children}
        </div>
      </Table.Header>

      <Table.Body>
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
              <svg
                className="h-7 w-7 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              {emptyMessage}
            </h3>
            <p className="mt-1 text-sm text-gray-400 max-w-xs">
              {emptyDescription}
            </p>
          </div>
        ) : (
          displayed.map((item) => <Table.Row key={item.id} data={item} />)
        )}
      </Table.Body>
    </Table.Root>
  );
}
