import { type BaseFunction, dispose } from "&utils/function";

type MethodKeys<T extends object> = {
  [K in keyof T]: T[K] extends BaseFunction ? K : never
}[keyof T];

type Listener<T, O> = T extends (...args: infer A) => infer R ? (
  (this: O, ...args: [...A, Value<R>]) => any
) : () => any;

type Listeners<T extends object> = {
  [K in MethodKeys<T>]?: Listener<T[K], T>
};

type Value<T> = T extends PromiseLike<infer R> ? Value<R> : T;

export class Observer {
  subscribe<K extends MethodKeys<this>>(event: K, listener: Listener<this[K], this>) {
    const key = Symbol.for('$' + String(event));
    if (!(key in this))
      throw new Error('Can not observe "' + String(event) + '"');

    const subs = (this[key] ?? (
      this[key] = new Set()
    )) as Set<Listener<this[K], this>>;

    subs.add(listener);
    return () => { subs.delete(listener); };
  }

  subscribeMany(listeners: Listeners<this>) {
    return dispose(
      ...Object.entries(listeners)
        .map(([event, value]: any) => (
          this.subscribe(event, value)
        ))
    );
  }
}

type Class<T> = new (...args: any[]) => T;
type Subs = { [K: symbol]: Set<(...args: any[]) => any>; };

export function observe<T extends object, F extends (...args: any[]) => any>(
  target: Class<T>['prototype'],
  key: keyof T,
  { value }: TypedPropertyDescriptor<F>
) {
  const symbolKey = Symbol.for('$' + String(key));
  target[symbolKey] = undefined;

  return {
    value(this: Subs, ...args) {
      const subs = this[symbolKey];
      const result = value?.apply(this, args);

      Promise.resolve(result)
        .then(result => {
          subs?.forEach(sub => {
            sub.call(this, ...args, result);
          });
        });

      return result;
    }
  } as TypedPropertyDescriptor<F>;
}