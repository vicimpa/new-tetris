import { Signal, useSignal } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";
import { VNode } from "preact";
import { createContext, createPortal, JSX, PropsWithChildren, useContext, useEffect, useId, useMemo, useRef } from "preact/compat";
import { Outside } from "./Outside";

const PopupContext = createContext<Signal<HTMLDivElement | null> | null>(null);
const PopupShowerContext = createContext<Signal<VNode[]> | null>(null);

export const PopupProvider = ({ children }: PropsWithChildren) => {
  const ref = useSignalRef<HTMLDivElement | null>(null);
  const shower = useSignal<VNode[]>([]);

  return (
    <>
      <PopupContext.Provider value={ref}>
        <PopupShowerContext.Provider value={shower}>
          {children}
        </PopupShowerContext.Provider>
        {shower}
      </PopupContext.Provider>
      <div ref={ref} class="popup-container" />
    </>
  );
};

export type PopupViewProps = Omit<JSX.IntrinsicElements['div'], 'ref' | 'className'> & {
  onOutsideClick?: (e: MouseEvent) => any;
  onOutsideMouseDown?: (e: MouseEvent) => any;
  onOutsideMouseUp?: (e: MouseEvent) => any;
};

export const PopupView = ({
  class: className,
  children,
  onOutsideClick,
  onOutsideMouseDown,
  onOutsideMouseUp,
  ...props
}: PopupViewProps) => {
  const ctx = useContext(PopupContext);
  const value = ctx?.value;
  if (!value) return;

  return createPortal(
    <div class={className + ' popup'} {...props}>
      <div>
        <Outside
          onClick={onOutsideClick}
          onMouseDown={onOutsideMouseDown}
          onMouseUp={onOutsideMouseUp}
        >
          {children}
        </Outside>
      </div>
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
    show(children: VNode, props: Omit<PopupViewProps, 'key' | 'children'> = {}) {
      let active = true;
      const key = id + '-' + counter.current++;

      const close = () => {
        if (!active) return;
        active = false;
        disposes.delete(close);
        shower.value = shower.peek().filter(e => e.key !== node.key);
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