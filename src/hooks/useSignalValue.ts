import { useComputed, useSignal } from "@preact/signals-react";
import { useLayoutEffect } from "react";

export function useSignalValue<T>(value: T) {
  const signal = useSignal(value);

  useLayoutEffect(() => {
    signal.value = value;
  }, [value]);

  return useComputed(() => signal.value);
}