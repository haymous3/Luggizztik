import Logo from "@/components/ui/Logo";
import {auth} from "@/features/auth/auth";
import SwitchTabButton from "@/components/ui/SwitchTab";
import HeaderIcons from "./HeaderIcons";

export const AuthHeader = async () => {
  const session = await auth();

  const name = session?.user.name?.split(" ")[0] || session?.user.username || session?.user.email;
  const role = session?.user.role ?? "carrier";

  return (
    <div>
      <div className="flex justify-between items-center">
        <Logo />
        <HeaderIcons role={role} />
      </div>
      <div className="mt-10">
        <h2 className="text-brand-1 font-bold text-2xl">Hey, {name}</h2>
      </div>

      {role === "shipper" ? (
        <div>
          <h2>Manage your shipments and track your logistics operations</h2>

          <SwitchTabButton
            options={[
              {href: "/dashboard/shipper", name: "Overview"},
              {href: "/dashboard/shipper/post_load", name: "Post Loads"},
              {href: "/dashboard/shipper/my_shipment", name: "My Shipment"},
              {href: "/dashboard/shipper/active_bids", name: "Active Bids"},
            ]}
          />
        </div>
      ) : (
        <div>
          <h2>Find loads, manage your routes, and track your earnings</h2>
          <SwitchTabButton
            options={[
              {href: "/dashboard/carrier", name: "Overview"},
              {href: "/dashboard/carrier/find_loads", name: "Find Loads"},
              {href: "/dashboard/carrier/active_jobs", name: "Active Jobs"},
              {href: "/dashboard/carrier/earnings", name: "Earnings"},
              {href: "/dashboard/carrier/my_truck", name: "My Trucks"},
            ]}
          />
        </div>
      )}
    </div>
  );
};
