import type { Game } from "&core/Game";
import { hiscoreStore, Stats } from "&core/Stats";
import { score } from "&data/config";
import { useEffect, useMemo } from "react";
import { effect } from "@preact/signals-react";

export function useStats(game: Game) {
  const stats = useMemo(() => new Stats(), [game]);

  let lastY = Infinity;

  useEffect(() => (
    effect(() => {
      if (hiscoreStore.peek() < stats.score)
        hiscoreStore.value = stats.score;
    })
  ), [stats]);

  useEffect(() => (
    game.subscribeMany({
      drop(count) {
        const combo = stats.drop(count);
        const base = score.drop[count];
        const add = (score.clean[count]) * +game.map.empty();
        const factor = score.combo[combo] ?? 1;
        stats.add((base + add) * factor);
      },
      fix() {
        stats.fix();
      },
      dash([f, _x, y]) {
        f && stats.add((y - this.lastY) * score.dash);
      },
      move(_x, y, moved) {
        if (!y || !moved || lastY < y)
          return;
        lastY = y;
        stats.add(1);
      },
      setNow() {
        lastY = Infinity;
      }
    })
  ), [game]);

  return stats;
}