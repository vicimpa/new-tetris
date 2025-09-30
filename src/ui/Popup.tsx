import { Signal, useSignal } from "@preact/signals-react";
import { useSignalRef } from "@preact/signals-react/utils";
import { createContext, type JSX, type PropsWithChildren, useContext, useEffect, useId, useMemo, useRef, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Outside } from "./Outside";

const PopupContext = createContext<Signal<HTMLDivElement | null> | null>(null);
const PopupShowerContext = createContext<Signal<ReactNode[]> | null>(null);

export const PopupProvider = ({ children }: PropsWithChildren) => {
  const ref = useSignalRef<HTMLDivElement | null>(null);
  const shower = useSignal<ReactNode[]>([]);

  return (
    <>
      <PopupContext.Provider value={ref}>
        <PopupShowerContext.Provider value={shower}>
          {children}
        </PopupShowerContext.Provider>
        {shower}
      </PopupContext.Provider>
      <div ref={ref} className="popup-container" />
    </>
  );
};

export type PopupViewProps = JSX.IntrinsicElements['div'] & {
  onOutsideClick?: (e: MouseEvent) => any;
  onOutsideMouseDown?: (e: MouseEvent) => any;
  onOutsideMouseUp?: (e: MouseEvent) => any;
};

export const PopupView: FC<PopupViewProps> = ({
  className,
  children,
  onOutsideClick,
  onOutsideMouseDown,
  onOutsideMouseUp,
  ...props
}) => {
  const ctx = useContext(PopupContext);
  const value = ctx?.value;
  if (!value) return;

  return createPortal(
    <div className={className + ' popup'} {...props}>
      <Outside
        onClick={onOutsideClick}
        onMouseDown={onOutsideMouseDown}
        onMouseUp={onOutsideMouseUp}
      >
        {children}
      </Outside>
    </div>,
    value
  );
};

export function usePopup() {
  const id = useId();
  const ctx = useContext(PopupContext);
  const shower = useContext(PopupShowerContext);
  const counter = useRef(0);
  const disposes = useMemo(() => new Set<() => void>(), []);

  if (!ctx || !shower)
    throw new Error('Can not prove PopupContext');

  useEffect(() => () => {
    disposes.forEach(fn => fn());
  }, []);

  return {
    show(children: ReactNode, props: Omit<PopupViewProps, 'key' | 'children'> = {}) {
      let active = true;
      const key = id + '-' + counter.current++;

      const close = () => {
        if (!active) return;
        active = false;
        disposes.delete(close);
        shower.value = shower.peek().filter(e => e !== node);
      };

      const node = (
        <PopupView
          key={key}
          {...props}
        >
          {children}
        </PopupView>
      );

      shower.value = [...shower.peek(), node];
      disposes.add(close);

      return close;
    },
  };
}