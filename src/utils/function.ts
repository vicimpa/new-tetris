export function ref<T extends (...args: any[]) => any>(fn: T) {
  const result = Object.assign(
    function _fn(...args: any[]) {
      return result.current.apply(this, args);
    },
    { current: fn }
  );

  return result as T & { current: T; };
}