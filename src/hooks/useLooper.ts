import { FrameLoop, looper } from "&utils/looper";
import { useEffect } from "preact/hooks";
import { useEvent } from "./useEvent";

export function useLooper(fn: FrameLoop) {
  const fnRef = useEvent(fn);
  useEffect(() => looper(fnRef), []);
}