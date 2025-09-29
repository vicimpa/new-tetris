import { Game } from "&core/Game";
import { filter } from "&utils/filter";
import { dispose } from "&utils/function";
import { useLooper } from "./useLooper";
import { useEffect, useMemo, useRef } from "preact/hooks";

type ShackerRef = (<T extends HTMLElement>(current: T | null) => any) & {
  pushX(x: number): void;
  pushY(y: number): void;
  pushS(s: number): void;
};

export function useShaker(
  game: Game,
): ShackerRef {
  const ref = useRef<HTMLElement>(null);

  const data = useMemo(() => ({
    x: 0,
    y: 0,
    s: 0,
    fx: filter(10),
    fy: filter(10),
    sx: filter(3),
    sy: filter(3),
  }), []);

  useEffect(() => (
    dispose(
      game.subscribeMany({
        move(x, y, moved) {
          data.x += 5 * x * +!moved;
          data.y += 5 * y * +!moved;
        },
        fix() {
          data.s += 5;
          data.y -= 10;
        },
        drop(count) {
          data.s += 10 * count;
        },
        dash([fig, _x, y]) {
          if (!fig) return;
          data.y -= (y - this.lastY) * 3;
        },
        loose() {
          data.y -= 100;
          data.s += 200;
        },
      }),
    )
  ), [game]);

  useLooper((delta) => {
    if (Math.abs(data.x) < 1) data.x = 0;
    if (Math.abs(data.y) < 1) data.y = 0;
    if (Math.abs(data.s) < 1) data.s = 0;

    data.x -= data.x * delta * .01;
    data.y -= data.y * delta * .01;
    data.s -= data.s * delta * .01;

    const { current: elem } = ref;
    if (!elem) return;
    const x = data.fx(data.x) + data.sx(Math.random() * data.s);
    const y = data.fy(data.y) + data.sx(Math.random() * data.s);
    elem.style.transform = `translateX(${x}px) translateY(${-y}px)`;
  });

  return Object.assign(
    (current: any) => { ref.current = current; },
    {
      pushX(v: number) {
        data.x += v;
      },
      pushY(v: number) {
        data.y += v;
      },
      pushS(v: number) {
        data.s += v;
      }
    }
  );
}