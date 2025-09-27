import { useState } from "preact/hooks";
import { useEvent } from "./useEvent";

export function useReload() {
  const [_, setState] = useState({});
  return useEvent(() => setState({}));
}