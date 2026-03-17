import Logo from "@/components/ui/Logo";
import {auth} from "@/features/auth/auth";
import SwitchTabButton from "@/components/ui/SwitchTab";
import HeaderIcons from "./HeaderIcons";

export const AuthHeader = async () => {
  const session = await auth();

  const name = session?.user.name?.split(" ")[0] || session?.user.username || session?.user.email;
  const role = session?.user.role ?? "carrier";

  return (
    <div className="min-w-0">
      <div className="flex justify-between items-center gap-4">
        <Logo />
        <HeaderIcons role={role} />
      </div>
      <div className="mt-6 sm:mt-10">
        <h2 className="text-brand-1 font-bold text-xl sm:text-2xl truncate">Hey, {name}</h2>
      </div>

      {role === "shipper" ? (
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base text-muted-foreground mt-1">Manage your shipments and track your logistics operations</h2>

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
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base text-muted-foreground mt-1">Find loads, manage your routes, and track your earnings</h2>
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
