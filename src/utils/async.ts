export type EmptyFunction = () => any;

export function nextTick(fn: EmptyFunction) {
  var _fn: EmptyFunction | null = fn;

  Promise.resolve()
    .then(() => _fn?.());

  return () => {
    _fn = null;
  };
}

export function delay(n: number) {
  return new Promise(r => setTimeout(r, n));
}