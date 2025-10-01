export function makeStore<T, O extends object, A extends any[]>(fn: ((target: O, ...args: A) => T) | (() => T)) {
  const map = new WeakMap<object, T>();

  return (target: O, ...args: A) => {
    var out: T;
    return map.get(target) ?? (
      map.set(target, out = fn(target, ...args)),
      out
    );
  };
}