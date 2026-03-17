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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./dialog";

type ModalContextType = {
  openModal: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [openModal, setOpenModal] = useState<string>("");

  const close = () => setOpenModal("");
  const open = setOpenModal;

  return (
    <ModalContext.Provider value={{ openModal, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

type ClickableElement = ReactElement<{ onClick?: (e?: MouseEvent) => void }>;

type OpenProps = {
  children: ClickableElement;
  opens: string;
};

export function Open({ children, opens: opensWindowName }: OpenProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal.Open must be used within <ModalProvider>");

  const { open } = ctx;

  const originalOnClick = children.props.onClick;

  const mergedOnClick = (e?: MouseEvent) => {
    try {
      originalOnClick?.(e);
    } catch (e) {
      console.log(e);
    }
    open(opensWindowName);
  };

  return cloneElement(children, { onClick: mergedOnClick });
}

type WindowProps = {
  name: string;
  children: ReactNode;
};

type ModalChildProps = {
  onCloseModal?: () => void;
};

export function Window({ children, name }: WindowProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal.Window must be used within <ModalProvider>");

  const { openModal, close } = ctx;

  if (openModal !== name) return null;

  const handleClose = () => close();

  let childToRender = children;

  if (React.isValidElement(children) && typeof children.type !== "string") {
    childToRender = cloneElement(
      children as React.ReactElement<ModalChildProps>,
      {
        onCloseModal: handleClose,
      }
    );
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && close()}>
      <DialogContent className="w-[50%] max-w-none px-16 py-12">
        <DialogTitle className="sr-only">Dialog</DialogTitle>
        <div>{childToRender}</div>
      </DialogContent>
    </Dialog>
  );
}

ModalProvider.Open = Open;
ModalProvider.Window = Window;
export type { ModalContextType };
