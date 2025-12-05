import {useEffect, useRef, RefObject} from "react";

type UseCloseModalReturn = {
  ref: RefObject<HTMLDivElement | null>;
};

export const useCloseModal = (
  handler: () => void,
  listenCapturing: boolean = true
): UseCloseModalReturn => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };

    document.addEventListener("click", handleClick, listenCapturing);

    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return {ref};
};
