import { signal, Signal } from "@preact/signals";
import { RefObject, SignalLike } from "preact";

export type MaybeSignal<T> = T | Signal<T>;

export type Unsignal<T> = T extends Signal<infer V> ? Unsignal<V> : T;

export type SignalRef<T> = Signal<T> & RefObject<T>;

export function unsignal<T>(value: T): Unsignal<T> {
  while (value instanceof Signal)
    value = value.value;
  return value as Unsignal<T>;
}

export function signalRef<T>() {
  const ref = signal<T | null>(null);

  return (
    Object.defineProperties(ref, {
      current: {
        get() {
          return ref.peek();
        },
        set(v) {
          ref.value = v;
        }
      }
    })
  ) as SignalRef<T | null>;
}