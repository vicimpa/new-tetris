import { Render } from "&core/Render";
import { effect } from "@preact/signals";

export function draw(fn: (ctx: Render) => void | (() => void)) {
  const can = document.createElement('canvas');
  const ctx = Render.fromCanvas(can);
  if (!ctx) return can;
  effect(() => fn(ctx));
  return can;
}