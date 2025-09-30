import { type FrameLoop, looper } from "&utils/looper";
import { useEffect } from "react";
import { useEvent } from "./useEvent";

export function useLooper(fn: FrameLoop) {
  const fnRef = useEvent(fn);
  useEffect(() => looper(fnRef), [fnRef]);
}