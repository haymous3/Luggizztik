"use client";

import {createContext, useContext, useState, ReactNode} from "react";
import {UserCircleIcon, EyeIcon} from "@heroicons/react/24/outline";
import {usePathname} from "next/navigation";
import ModalProvider from "./Modal";
import {Menu as MenusMenu} from "./Menu";
import Bidders from "@/features/shipper/components/Bidders";

interface TableContextType {
  sortColumn: string | null;
  setSortColumn: (col: string) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useTable = () => {
  const ctx = useContext(TableContext);
  if (!ctx)
    throw new Error(
      "Table compound components must be used within <Table.Root>"
    );
  return ctx;
};

type TableRootProps = {children: ReactNode; width?: string};
type SubProps = {children: ReactNode};

type RowData = {
  id: number;
  name?: string;
  cargoType?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  budget?: {from: string; to: string};
  from?: string;
  to?: string;
  driver?: string;
  status?: string;
  eta?: string;
  price?: string;
  bids?: string[];
};
type RowProps<T = RowData> = {
  data: T;
};

function getStatusStyle(status?: string) {
  const s = status?.toLowerCase();
  if (s === "transit")
    return "bg-emerald-600 text-white";
  if (s === "pickup pending" || s === "open for bids")
    return "bg-amber-100 text-amber-800 border border-amber-300";
  if (s === "delivered")
    return "bg-blue-100 text-blue-800 border border-blue-200";
  if (s === "cancelled")
    return "bg-red-100 text-red-700 border border-red-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

function formatPrice(price?: string) {
  if (!price || price === "-") return price;
  const num = Number(price);
  if (isNaN(num)) return price;
  return `\u20A6${num.toLocaleString()}`;
}

const Root = ({children, width}: TableRootProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  return (
    <TableContext.Provider value={{sortColumn, setSortColumn}}>
      <div
        className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 py-6 px-6 mt-8 rounded-xl shadow-sm"
        style={{width}}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};

const Header = ({children}: SubProps) => (
  <div className="mb-2">{children}</div>
);

const Body = ({children}: SubProps) => (
  <div className="flex flex-col gap-3 mt-4">{children}</div>
);

const Row = <T extends RowData>({data}: RowProps<T>) => {
  const pathName = usePathname();

  const {
    id,
    name,
    cargoType,
    pickupLocation,
    deliveryLocation,
    from,
    to,
    driver,
    status,
    eta,
    price,
    bids,
  } = data;

  const showViewBid = pathName === "/dashboard/shipper/active_bids";
  const isCarrier =
    pathName === "/dashboard/carrier" ||
    pathName === "/dashboard/carrier/earnings";

  const origin = from || pickupLocation;
  const destination = to || deliveryLocation;

  return (
    <ModalProvider>
      <MenusMenu>
        <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          {/* Left: avatar + info */}
          <div className="flex gap-4 items-center min-w-0">
            {!bids && (
              <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-full bg-gray-100">
                <UserCircleIcon className="w-7 h-7 text-gray-400" />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {name || cargoType}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {origin}
                <span className="mx-1.5 text-gray-400">&rarr;</span>
                {destination}
              </p>
              {bids && !isCarrier ? (
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  {bids.length} bid{bids.length !== 1 ? "s" : ""} received
                </p>
              ) : !isCarrier && driver ? (
                <p className="text-xs text-gray-400 mt-1">
                  Driver: {driver}
                </p>
              ) : null}
            </div>
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {showViewBid ? (
              <ModalProvider.Open opens="bidders">
                <li className="list-none">
                  <button className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                    View Bids
                  </button>
                </li>
              </ModalProvider.Open>
            ) : (
              <div className="flex items-center gap-5">
                <div className="text-right space-y-1">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyle(status)}`}
                  >
                    {status}
                  </span>
                  {eta && eta !== "-" && (
                    <p className="text-xs text-gray-400">ETA: {eta}</p>
                  )}
                  <p className="text-sm font-bold text-emerald-700">
                    {formatPrice(price)}
                  </p>
                </div>

                {!isCarrier && (
                  <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                    Track
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <ModalProvider.Window name="bidders">
          <Bidders id={id} />
        </ModalProvider.Window>
      </MenusMenu>
    </ModalProvider>
  );
};

export const Table = {
  Root,
  Header,
  Body,
  Row,
};
