"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {createPortal} from "react-dom";
import {useCloseModal} from "@/app/_hooks/useCloseModal";

// ---------- Types ----------
type PositionType = {x: number; y: number} | null;

type MenusContextType = {
  openId: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
  position: PositionType;
  setPosition: Dispatch<SetStateAction<PositionType>>;
};

const MenusContext = createContext<MenusContextType | undefined>(undefined);

/* Top-level provider */
export default function MenusProvider({children}: {children: ReactNode}) {
  const [openId, setOpenId] = useState<string>("");
  const [position, setPosition] = useState<PositionType>(null);

  const close = () => setOpenId("");

  return (
    <MenusContext.Provider
      value={{openId, open: setOpenId, close, position, setPosition}}
    >
      {children}
    </MenusContext.Provider>
  );
}

/* Simple layout wrapper (keeps your existing structure) */
export function Menu({children}: {children: ReactNode}) {
  return <div className="relative inline-block w-full">{children}</div>;
}

/* ---------- List (the floating menu) ---------- */
interface ListProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function List({id, children, className}: ListProps) {
  const ctx = useContext(MenusContext);
  if (!ctx) throw new Error("Menus.List must be used within <Menus>");

  const {openId, position, close} = ctx;

  // useCloseModal used to close when clicking outside
  const {ref} = useCloseModal(() => close(), false);

  if (openId !== id) return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        transform: "translateY(4px)",
      }}
      className={`z-50 bg-white rounded-md shadow-md ${className ?? ""}`}
    >
      {children}
    </div>,
    document.body
  );
}

/* ---------- Button (menu item) ---------- */
interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  closeOnClick?: boolean; // defaults true
}

export function Button({
  children,
  icon,
  onClick,
  closeOnClick = true,
}: ButtonProps) {
  const ctx = useContext(MenusContext);
  if (!ctx) throw new Error("Menus.Button must be used within <Menus>");

  const {close} = ctx;

  const handleClick = () => {
    try {
      onClick?.();
    } finally {
      if (closeOnClick) close();
    }
  };

  return (
    <li className="list-none">
      <button
        onClick={handleClick}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{children}</span>
        </div>
      </button>
    </li>
  );
}

/* Attach subcomponents */
MenusProvider.Menu = Menu;
MenusProvider.List = List;
MenusProvider.Button = Button;

export type {MenusContextType};
