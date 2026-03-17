"use client";

import {usePathname} from "next/navigation";
import Link from "next/link";

type OptionField = {
  text?: string;
  tab?: string;
  name?: string;
  href: string;
};

type SwitchButtonProps = {
  options: OptionField[];
};

const SwitchTabButton = ({options}: SwitchButtonProps) => {
  const pathName = usePathname();

  return (
    <nav className="mt-4 -mx-4 sm:mx-0">
      <ul className="bg-[#f4f4f4] flex p-1 rounded-lg border border-border overflow-x-auto sm:overflow-visible">
        {options.map((link) => (
          <li key={link.name} className="flex-1 min-w-[max(8rem,22%)] sm:min-w-0">
            <Link
              className={`block py-2.5 rounded-md px-3 sm:px-5 text-center text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                pathName === link.href
                  ? "bg-white text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SwitchTabButton;
