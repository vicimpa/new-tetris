import { BaseFunction, refFunction } from "&utils/function";
import { useMemo } from "preact/hooks";

export function useEvent<T extends BaseFunction>(current: T) {
  return Object.assign(useMemo(() => refFunction(current), []), { current });
}