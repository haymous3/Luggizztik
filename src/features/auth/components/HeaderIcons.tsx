"use client";

import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {useState} from "react";

type HeaderIconsProps = {
  role: string;
};

const icons = [
  {
    key: "notifications",
    label: "Notifications",
    Icon: BellIcon,
    href: null,
  },
  {
    key: "settings",
    label: "Settings",
    Icon: Cog6ToothIcon,
    href: null,
  },
  {
    key: "profile",
    label: "My Profile",
    Icon: UserIcon,
    hrefByRole: {carrier: "/dashboard/carrier/profile", shipper: "/dashboard/shipper/profile"},
  },
  {
    key: "logout",
    label: "Sign Out",
    Icon: ArrowRightOnRectangleIcon,
    href: null,
    isLogout: true,
  },
] as const;

const HeaderIcons = ({role}: HeaderIconsProps) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div className="flex gap-2 sm:gap-5 items-center shrink-0">
      {icons.map((item) => {
        const href =
          "hrefByRole" in item
            ? item.hrefByRole[role as keyof typeof item.hrefByRole] ?? null
            : item.href;
        const isLogout = "isLogout" in item && item.isLogout;

        const iconElement = (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => setHoveredKey(item.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={
                isLogout ? () => signOut({callbackUrl: "/signin"}) : undefined
              }
            >
              <item.Icon className="w-5 h-5 text-gray-700" />
            </button>

            {hoveredKey === item.key && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-50 pointer-events-none">
                {item.label}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        );

        if (href && !isLogout) {
          return (
            <Link key={item.key} href={href}>
              {iconElement}
            </Link>
          );
        }

        return iconElement;
      })}
    </div>
  );
};

export default HeaderIcons;
