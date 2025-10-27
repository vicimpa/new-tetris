export type FrameLoop = (delta: number, time: number) => any;

const { requestAnimationFrame, cancelAnimationFrame } = window;

export function looper(fn: FrameLoop, sync = true) {
  var time = -1;

  function loop(now: number) {
    var delta = now - time;
    time = now;
    if (delta < 100) fn(delta, time);
  }

  if (sync) {
    var raf = -1;
    function _fn(now = performance.now()) {
      raf = requestAnimationFrame(_fn);
      loop(now);
    };
    _fn();
    return () => cancelAnimationFrame(raf);
  }

  var timer = setInterval(() => loop(performance.now()));
  return () => clearInterval(timer);
}