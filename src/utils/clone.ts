export function clone<T extends object>(o: T): T {
  return Object.setPrototypeOf(
    structuredClone(o),
    Object.getPrototypeOf(o)
  );
}