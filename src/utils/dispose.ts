export function dispose(...args: (void | (() => void))[]) {
  return () => {
    args.forEach(
      fn => fn instanceof Function && fn()
    );
  };
}