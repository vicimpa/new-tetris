import { useComputed, useSignal } from "@preact/signals";
import { useLayoutEffect } from "preact/hooks";

export function useSignalValue<T>(value: T) {
  const signal = useSignal(value);

  useLayoutEffect(() => {
    signal.value = value;
  }, [value]);

  return useComputed(() => signal.value);
}