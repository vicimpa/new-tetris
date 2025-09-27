export type BaseFunction = () => any;

export function nextTick(fn: BaseFunction) {
  var _fn: BaseFunction | null = fn;

  Promise.resolve()
    .then(() => _fn?.());

  return () => {
    _fn = null;
  };
}

export function delay(n: number) {
  return new Promise(r => setTimeout(r, n));
}