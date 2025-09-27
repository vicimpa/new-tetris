import { useCallback, useRef } from "preact/hooks";

export function useEvent<T extends (...args: any[]) => any>(fn: T) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback(
    function (...args: any[]) {
      return ref.current.apply(this, args);
    } as T,
    []
  );
}