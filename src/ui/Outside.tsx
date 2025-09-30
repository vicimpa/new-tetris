import { type PropsWithChildren, useEffect, useRef } from "react";

export type OutsideProps = {
  onMouseDown?: (e: MouseEvent) => any;
  onMouseUp?: (e: MouseEvent) => any;
  onClick?: (e: MouseEvent) => any;
} & PropsWithChildren;


const isOutside = (target: EventTarget | null, elem?: Element | null) => {
  if (!(target instanceof HTMLElement))
    return true;

  if (elem && !target.contains(elem))
    return false;

  return true;
};

export const Outside = ({ children, onMouseDown, onMouseUp, onClick }: OutsideProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    addEventListener('mousedown', (e) => {
      if (isOutside(e.target, ref.current))
        onMouseDown?.(e);
    }, ctrl);

    addEventListener('mouseup', (e) => {
      if (isOutside(e.target, ref.current))
        onMouseUp?.(e);
    }, ctrl);

    addEventListener('click', (e) => {
      if (isOutside(e.target, ref.current))
        onClick?.(e);
    }, ctrl);

    return () => {
      ctrl.abort();
    };
  }, []);

  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {children}
    </div>
  );
};