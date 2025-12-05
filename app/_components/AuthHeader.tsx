import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import {BellIcon, UserIcon} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import {auth} from "@/app/_lib/server/auth";

import SwitchTabButton from "./SwitchTab";

// type AuthHeaderProps = {
//   referer: string
// }

export const AuthHeader = async () => {
  const session = await auth();

  // console.log(session?.user);
  // console.log(referer)
  // console.log(referer.includes("/dashboard/shipper"));

  const name = session?.user.name.split(" ")[0] || session?.user.email;
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Logo />
        </div>
        <div className="flex gap-6">
          <BellIcon className="w-6 h-6 text-black" />
          <Cog6ToothIcon className="w-6 h-6 text-black" />
          <UserIcon className="w-6 h-6 text-black" />
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-black" />
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-brand-1 font-bold text-2xl">Hey, {name}</h2>
      </div>

      {session?.user?.role === "shipper" ? (
        <div>
          <h2>Manage your shipments and track your logistics operations</h2>

          <SwitchTabButton
            options={[
              {
                href: "/dashboard/shipper",
                name: "Overview",
              },
              {
                href: "/dashboard/shipper/post_load",
                name: "Post Loads",
              },
              {
                href: "/dashboard/shipper/my_shipment",
                name: "My Shipment",
              },
              {
                href: "/dashboard/shipper/active_bids",
                name: "Active Bids",
              },
            ]}
          />
        </div>
      ) : (
        <div>
          <h2>Find loads, manage your routes, and track your earnings</h2>
          <SwitchTabButton
            options={[
              {
                tab: "overview",
                text: "Overview",
                href: "/dashboard/carrier",
                name: "Overview",
              },
              {
                tab: "loads",
                text: "Find Loads",
                href: "/dashboard/carrier/find_loads",
                name: "Find Loads",
              },
              {
                tab: "jobs",
                text: "Active Jobs",
                href: "/dashboard/carrier/active_jobs",
                name: "Active Jobs",
              },
              {
                tab: "earnings",
                text: "Earnings",
                href: "/dashboard/carrier/earnings",
                name: "Earnings",
              },
              {
                tab: "truck",
                text: "My Trucks",
                href: "/dashboard/carrier/my_truck",
                name: "My Trucks",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
