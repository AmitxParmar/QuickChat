import React, { HTMLAttributes, useEffect, useRef } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
};

export default function OutsideClick({
  children,
  className,
  onOutsideClick,
}: {
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>;
  onOutsideClick: (...args: any[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    onOutsideClick();
  });

  return (
    <div ref={ref} {...className}>
      {children}
    </div>
  );
}
