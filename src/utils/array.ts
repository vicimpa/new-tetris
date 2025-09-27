export function array<T>(length: number, fn: ((i: number) => T) | T) {
  return Array.from({ length }, fn instanceof Function ? (_, i) => fn(i) : () => fn);
}

export function randomItem<T>(items: T[], random = Math.random) {
  return items[random() * items.length | 0];
}