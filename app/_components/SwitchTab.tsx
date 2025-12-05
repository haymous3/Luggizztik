"use client";

import {usePathname} from "next/navigation";
//import Button from "./Button";
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
    <nav>
      <ul className="bg-[#f4f4f4] flex justify-between py-2 px-3 rounded-sm mt-4">
        {options.map((link) => (
          <li key={link.name}>
            <Link
              className={`py-2 rounded-sm px-5 hover:bg-white transition-colors flex items-center gap-4 font-semibold text-primary-200 ${
                pathName === link.href ? "bg-white" : ""
              }`}
              href={link.href}
            >
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SwitchTabButton;
