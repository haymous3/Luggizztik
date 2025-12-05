"use client";

import {useFormStatus} from "react-dom";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  tab?: string;
  activeTab?: string;
  handleFilterChange?: (tab: string) => void;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  pendingLabel,
  className,
  tab,
  activeTab,
  handleFilterChange,
}) => {
  const {pending} = useFormStatus();

  let style;

  if (type === "submit") {
    style = "bg-brand-3 mt-5 w-full py-2 rounded-sm font-bold cursor-pointer";
  }

  if (type === "button") {
    style = `${className} ${tab === activeTab ? "bg-white" : ""}`;
  }

  return (
    <button
      onClick={() => handleFilterChange?.(tab ?? "")}
      type={type}
      className={`${style}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
};

export default Button;
