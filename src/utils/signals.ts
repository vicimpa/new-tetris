import { signal, Signal } from "@preact/signals-react";
import { makeDataPack, type TypeValue } from "@vicimpa/data-pack";
import { type RefObject } from "react";
import base64 from "&utils/base64";
import gzip from "./gzip";

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

async function signalPackedStore<T extends Schema>(name: string, schema: T): Promise<Signal<TypeValue<T> | null>>;
async function signalPackedStore<T extends Schema>(name: string, schema: T, defaultValue: TypeValue<T>): Promise<Signal<TypeValue<T>>>;
async function signalPackedStore(name: string, schema: Schema, defaultValue?: any) {
  const pack = makeDataPack(schema);
  const data = signal(defaultValue ?? null);

  async function parse() {
    try {
      const str = localStorage.getItem(name) ?? '';
      const buff = base64.toBuffer(str);
      const decoded = await gzip.decode(buff);
      data.value = pack.read(decoded);
    } catch (e) { }
  }

  await parse();
  data.subscribe(async (value) => {
    try {
      const buff = pack.write(value);
      const encoded = await gzip.encode(buff);
      const str = base64.fromBuffer(encoded);
      localStorage.setItem(name, str);
    } catch (e) { console.error(e); }
  });

  return data;
}

export { signalPackedStore };
