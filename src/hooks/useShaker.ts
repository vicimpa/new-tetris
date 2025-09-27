import { useEffect, useMemo } from "preact/hooks";
import { effect, signal, useSignalEffect } from "@preact/signals";
import { useEvent } from "./useEvent";
import { useSignalRef } from "@preact/signals/utils";
import { looper } from "&utils/looper";

export const useShaker = <T extends Record<string, number>>(
  initial: T,
  func: (el: HTMLElement, data: Readonly<T>) => any
) => {
  const refFunc = useEvent(func);
  const ref = useSignalRef<HTMLElement | null>(null);
  const data = useMemo(() => (
    Object.entries(initial)
      .reduce((acc, [key, init]) => {
        const d = signal(init);
        Object.defineProperty(acc, key, {
          get() {
            return d.value;
          },
          set(v) {
            d.value = v;
          }
        });
        return acc;
      }, {} as T)
  ), []);


  useEffect(() => (
    effect(() => {
      if (!ref.value) return;
      refFunc(ref.value, data);
    })
  ));

  useSignalEffect(() => {
    if (!ref.value) return;

    return looper((dtime) => {
      for (const key in initial) {
        const delta = data[key] - initial[key];
        (data as any)[key] = data[key] - (delta * dtime * .01);
        if (Math.abs(delta) < 1)
          data[key] = initial[key];
      }
    });
  });

  return [<T extends HTMLElement>(el: T) => { ref.value = el; }, data] as const;
};