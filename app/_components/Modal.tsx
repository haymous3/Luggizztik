"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  cloneElement,
  Dispatch,
  SetStateAction,
  MouseEvent,
} from "react";
import {createPortal} from "react-dom";
import {HiXMark} from "react-icons/hi2";
import {useCloseModal} from "@/app/_hooks/useCloseModal";

type ModalContextType = {
  openModal: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({children}: {children: ReactNode}) {
  const [openModal, setOpenModal] = useState<string>("");

  const close = () => setOpenModal("");
  const open = setOpenModal;

  return (
    <ModalContext.Provider value={{openModal, open, close}}>
      {children}
    </ModalContext.Provider>
  );
}

/* ---------------- Modal.Open ---------------- */
type ClickableElement = ReactElement<{onClick?: (e?: MouseEvent) => void}>;

type OpenProps = {
  children: ClickableElement;
  opens: string;
};

export function Open({children, opens: opensWindowName}: OpenProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal.Open must be used within <ModalProvider>");

  const {open} = ctx;

  // Merge original onClick with modal open behavior
  const originalOnClick = children.props.onClick;

  const mergedOnClick = (e?: MouseEvent) => {
    try {
      originalOnClick?.(e);
    } catch (e) {
      console.log(e);
      // swallow child click errors so modal still opens
      // optionally rethrow or log
    }
    open(opensWindowName);
  };

  return cloneElement(children, {onClick: mergedOnClick});
}

/* ---------------- Modal.Window ---------------- */
type WindowProps = {
  name: string;
  children: ReactNode; // may be element or plain nodes
};

type ModalChildProps = {
  onCloseModal?: () => void;
};

export function Window({children, name}: WindowProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal.Window must be used within <ModalProvider>");

  const {openModal, close} = ctx;
  const {ref} = useCloseModal(close);

  if (openModal !== name) return null;

  const handleClose = () => close();

  // Only inject onCloseModal into React component children (not HTML tags)
  let childToRender = children;

  if (React.isValidElement(children) && typeof children.type !== "string") {
    childToRender = cloneElement(
      children as React.ReactElement<ModalChildProps>,
      {
        onCloseModal: handleClose,
      }
    );
  }

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen bg-[rgba(255, 255, 255, 0.1)] backdrop-blur-sm z-[1000] transition-all duration-500">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className="fixed top-1/2 left-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-[0 2.4rem 3.2rem rgba(0, 0, 0, 0.12)] px-16 py-12 transition-all duration-500"
      >
        <button
          aria-label="Close modal"
          onClick={handleClose}
          className="absolute top-3 right-3"
        >
          <HiXMark />
        </button>

        <div>{childToRender}</div>
      </div>
    </div>,

    document.body
  );
}

/* Attach to default export for convenient import */
ModalProvider.Open = Open;
ModalProvider.Window = Window;
export type {ModalContextType};
