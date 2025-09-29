import { signal, Signal } from "@preact/signals";
import { makeDataPack, TypeValue } from "@vicimpa/data-pack";
import { RefObject } from "preact";
import base64 from "&utils/base64";

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

export function signalStore(name: string) {
  const data = signal(localStorage.getItem(name) ?? '');

  data.subscribe(value => {
    localStorage.setItem(name, value);
  });

  return data;
}

type Schema = Parameters<typeof makeDataPack>[0];

function signalPackedStore<T extends Schema>(name: string, schema: T): Signal<TypeValue<T> | null>;
function signalPackedStore<T extends Schema>(name: string, schema: T, defaultValue: TypeValue<T>): Signal<TypeValue<T>>;
function signalPackedStore(name: string, schema: Schema, defaultValue?: any): any {
  const pack = makeDataPack(schema);
  const data = signal(defaultValue ?? null);

  try {
    const str = localStorage.getItem(name) ?? '';
    const buff = base64.toBuffer(str);
    data.value = pack.read(buff);
  } catch (e) { console.error(e); }

  data.subscribe((value) => {
    try {
      const buff = pack.write(value);
      const str = base64.fromBuffer(buff);
      localStorage.setItem(name, str);
    } catch (e) { console.error(e); }
  });

  return data;
}

export { signalPackedStore };
