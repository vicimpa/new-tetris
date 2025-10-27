export type EmptyFunction = () => any;
export type RafFunction = (time: number) => any;

export function nextTick(fn: EmptyFunction) {
  var _fn: EmptyFunction | null = fn;

  Promise.resolve()
    .then(() => _fn?.());

  return () => {
    _fn = null;
  };
}

export function nextFrame(fn: RafFunction) {
  return cancelAnimationFrame.bind(null, requestAnimationFrame(fn));
}

export function nextTimeout(fn: EmptyFunction, n?: number) {
  return clearTimeout.bind(null, setTimeout(fn, n));
}

export function delay(n: number) {
  return new Promise(r => setTimeout(r, n));
}