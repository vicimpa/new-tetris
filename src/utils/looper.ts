export type FrameLoop = (delta: number, time: number) => any;

const { requestAnimationFrame, cancelAnimationFrame } = window;

export function looper(fn: FrameLoop) {
  var time = performance.now(), raf: number;
  _fn();

  function _fn(now = performance.now()) {
    raf = requestAnimationFrame(_fn);
    var delta = now - time;
    time = now;
    if (delta < 100) fn(delta, time);
  }

  return () => {
    cancelAnimationFrame(raf);
  };
}