export type BaseFunction = (...args: any[]) => any;
export type RefFunction<T extends BaseFunction> = T & { current: T; };

export function refFunction<T extends BaseFunction>(fn: T): RefFunction<T> {
  const result = Object.assign(
    function _fn(this: any, ...args: any[]) {
      return result.current.apply(this, args);
    } as T,
    { current: fn }
  );

  return result;
}

export function dispose(...args: (void | (() => void))[]) {
  return () => {
    args.forEach(
      fn => fn instanceof Function && fn()
    );
  };
}