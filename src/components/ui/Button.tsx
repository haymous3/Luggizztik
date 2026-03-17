"use client";

import { useFormStatus } from "react-dom";
import { Button as ShadcnButton } from "./button-base";
import { cn } from "@/lib/utils";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  tab?: string;
  activeTab?: string;
  handleFilterChange?: (tab: string) => void;
} & Omit<React.ComponentProps<typeof ShadcnButton>, "type">;

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  pendingLabel,
  className,
  tab,
  activeTab,
  handleFilterChange,
  variant,
  size,
  ...rest
}) => {
  const { pending } = useFormStatus();

  if (type === "submit") {
    return (
      <ShadcnButton
        type="submit"
        className={cn("bg-brand-3 mt-5 w-full py-2 font-bold hover:bg-brand-3/90", className)}
        disabled={pending}
        {...rest}
      >
        {pending ? pendingLabel : children}
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton
      type="button"
      variant={variant ?? "outline"}
      size={size}
      className={cn(tab === activeTab ? "bg-white" : "", className)}
      onClick={() => handleFilterChange?.(tab ?? "")}
      {...rest}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
