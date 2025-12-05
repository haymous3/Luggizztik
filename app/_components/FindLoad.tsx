"use client";
import React from "react";
import ModalProvider from "./Modal";
import {Menu as MenusMenu} from "@/app/_components/Menu";
import {MapPinIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import Button from "./Button";
import {formatRelative} from "date-fns";
import {usePathname} from "next/navigation";
import BidButton from "./BidButton";


type RowData = {
  id?: number;
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
  weight?: number;
  distance?: number;
  budget?: {from: string; to: string};
  pickupDate?: string;
  urgent?: boolean;
};

type RowProps<T = RowData> = {
  load: T;
};

const FindLoad = <T extends RowData>({load}: RowProps<T>) => {
  const {
    id,
    name,
    cargoType,
    pickupLocation,
    deliveryLocation,
    from,
    to,
    status,
    urgent,
    weight,
    distance,
    budget,
    pickupDate,
    eta,
    price,
  } = load;

  const now = new Date();

  const pathName = usePathname();

  return (
    <ModalProvider>
      <MenusMenu>
        <div className="bg-white mt-3 px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="w-10 h-10 text-black" />
              <div>
                <h3 className="font-bold">{name || cargoType}</h3>
                <h3>
                  {from || pickupLocation} to {to || deliveryLocation}
                </h3>
              </div>
            </div>

            {pathName !== "/dashboard/carrier/active_jobs" ? (
              <div>
                {urgent ? (
                  <h3 className="bg-[#F41313] text-white px-2 rounded-sm">
                    Urgent
                  </h3>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex justify-between items-center mt-3">
            {pathName !== "/dashboard/carrier/active_jobs" ? (
              <>
                <div className="text-center">
                  <h3 className="text-[#9F9898]">Weight</h3>
                  <p>{weight}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-[#9F9898]">Distance</h3>
                  <p>{distance}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-[#9F9898]">Budget</h3>
                  <p className="text-[#16A34A]">
                    {budget?.from} - {budget?.to}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-[#9F9898] ">Pickup Date</h3>
                  <p>
                    {pickupDate
                      ? formatRelative(new Date(pickupDate), now)
                      : "No pickup date"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3
                  className={`w-fit px-2 rounded-sm ${
                    status?.toLowerCase() === "transit"
                      ? "bg-[#333] text-brand-6"
                      : "bg-[#D9D9D9] text-black"
                  }`}
                >
                  {status}
                </h3>
                <h3>ETA: {eta}</h3>
                <h3 className="text-[#16A34A]">{price}</h3>
              </>
            )}
          </div>
          <div className="flex justify-between items-center mt-5">
            {pathName === "/dashboard/carrier/active_jobs" ? null : (
              <div className="flex gap-4 items-center">
                <MapPinIcon className="w-8 h-6 text-black" />
                <h3>Posted 2 hours ago</h3>
              </div>
            )}

            <div className="flex gap-3">
              {pathName !== "/dashboard/carrier/active_jobs" ? (
                <>
                  <Button
                    type="button"
                    className="bg-white border px-3 rounded-sm"
                  >
                    View Details
                  </Button>

                  {/* Here: we wrap the menu item with Modal.Open so clicking it will open modal "bids" */}
                  <ModalProvider.Open opens="bids">
                    {/* Menus.Button will receive the merged onClick (it will run its own onClick then open modal) */}
                    <li className="list-none">
                      <button className="px-3 py-1 rounded-sm bg-[#1FE21F] text-white flex items-center gap-2">
                        {/* <HiTrash /> */}
                        <span>Place Bid</span>
                      </button>
                    </li>
                  </ModalProvider.Open>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    className="bg-white border px-4 py-2 rounded-sm border-[#888]"
                  >
                    View Route
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal window content must be a React component (not a plain <h2>) so that Modal can inject onCloseModal */}
        <ModalProvider.Window name="bids">
          {/* <BidModal /> */}
          <BidButton shipmentId={load?.id ?? id} />
        </ModalProvider.Window>
      </MenusMenu>
    </ModalProvider>
  );
};

export default FindLoad;
