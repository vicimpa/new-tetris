import type { Render } from "&core/Render";
import { useMemo } from "react";
import { useEvent } from "./useEvent";

type Particle = (ctx: Render, delta: number) => boolean | void;

export function useParticleSystem<A extends any[]>(fn: (...args: A) => Particle) {
  const items = useMemo(() => new Set<Particle>(), []);
  const maker = useEvent(fn);

  return {
    spawn(size: number, ...args: A) {
      while (size-- > 0)
        items.add(maker(...args));
    },
    clear() {
      items.clear();
    },
    render(ctx: Render, delta: number) {
      items.forEach(run => run(ctx, delta) && items.delete(run));
    }
  };
}

export function makeParticleSystem<M extends any[], A extends any[]>(fn: (...args: M) => (...args: A) => Particle) {
  return (...args: M) => useParticleSystem(fn(...args));
}