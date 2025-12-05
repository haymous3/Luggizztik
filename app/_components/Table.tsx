"use client";

import {createContext, useContext, useState, ReactNode} from "react";

import {UserCircleIcon, EyeIcon} from "@heroicons/react/24/outline";
import {usePathname} from "next/navigation";
import ModalProvider from "./Modal";
import {Menu as MenusMenu} from "@/app/_components/Menu";
import Bidders from "./Bidders";

// Context
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

// Types
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

// Root
const Root = ({children, width}: TableRootProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  return (
    <TableContext.Provider value={{sortColumn, setSortColumn}}>
      <div
        className={`bg-linear-[90deg,rgba(107,45,32,0.10)_0%,rgba(31,226,31,0.10)_100%] bg-[#FFF] py-5 px-5 mt-8 rounded-sm`}
        style={{width}}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};

// Subcomponents
const Header = ({children}: SubProps) => <div className="">{children}</div>;

const Body = ({children}: SubProps) => <div>{children}</div>;

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

  let showViewBid = false;

  console.log(pathName);

  if (pathName === "/dashboard/shipper/active_bids") {
    showViewBid = true;
  }

  // const {} = data.time_price;

  // const minBid =
  //   bids && bids.length > 0
  //     ? bids.reduce((a, b) => (Number(a) < Number(b) ? a : b))
  //     : "No bid offered yet";

  //   const lowestBidObj =
  //   bids && bids.length > 0
  //     ? bids.reduce((min, bid) => (bid < min ? bid : min))
  //     : null;

  // const minBid = lowestBidObj || "No bid offered yet";

  return (
    <ModalProvider>
      <MenusMenu>
        <div className="flex justify-between bg-white mt-5 rounded-sm p-5">
          <div className="flex gap-5 items-center">
            {!bids && (
              <div>
                <UserCircleIcon className="w-10 h-10 text-black" />
              </div>
            )}

            <div>
              <h3 className="font-bold"> {name || cargoType}</h3>
              <h3>
                {from || pickupLocation} to {to || deliveryLocation}
              </h3>
              {bids &&
              pathName !== "dashboard/carrier" &&
              pathName !== " dashboard/carrier/earnings" ? (
                <h3>{bids?.length} bid recived</h3>
              ) : pathName === "/dashboard/carrier" ? (
                ""
              ) : pathName === "/dashboard/carrier/earnings" ? (
                ""
              ) : (
                <h3>Driver: {driver}</h3>
              )}
            </div>
          </div>
          <div className="flex gap-5 items-center">
            {showViewBid ? (
              <ModalProvider.Open opens="bidders">
                <li className="list-none">
                  <button className="px-3 py-1 rounded-sm bg-[#1FE21F] text-white flex items-center gap-2">
                    <span>View Bid</span>
                  </button>
                </li>
              </ModalProvider.Open>
            ) : (
              <div>
                <h3
                  className={`w-fit px-2 rounded-sm ${
                    status?.toLowerCase() === "transit"
                      ? "bg-[#333] text-brand-6"
                      : "bg-[#D9D9D9] text-black"
                  }`}
                >
                  {`In ${status}`}
                </h3>

                <h3>ETA: {eta}</h3>
                <h3 className="text-brand-1 font-bold">{price}</h3>

                {pathName !== "/dashboard/carrier" &&
                  pathName !== "/dashboard/carrier/earnings" && (
                    <div className="border flex gap-3 items-center rounded-lg px-4 py-2">
                      <EyeIcon className="w-6 h-6 text-black" />
                      <span className="font-semibold">Track</span>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
        <ModalProvider.Window name="bidders">
          <Bidders id={id}/>
        </ModalProvider.Window>
      </MenusMenu>
    </ModalProvider>
  );
};

// ✅ Export compound as a namespace object
export const Table = {
  Root,
  Header,
  Body,
  Row,
  // ColumnHeader,
};
