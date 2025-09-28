import { prop, reactive } from "@vicimpa/decorators";
import { observe, Observer } from "./Observer";
import { Game } from "./Game";
import { useEffect, useMemo } from "preact/hooks";
import { config } from "&data/config";

@reactive()
export class Stats extends Observer {
  @prop score = 0;
  @prop lines = 0;
  @prop fixed = 0;
  @prop combo = 0;

  @observe
  add(score: number) {
    this.score += score;
    console.log(score);
  }

  @observe
  fix() {
    this.fixed++;
  }

  @observe
  drop(count: number) {
    this.lines += count;
    try {
      if (!count && this.combo < 2)
        this.combo = 0;
      return this.combo;
    } finally {
      if (count) this.combo++;
      else this.combo = 0;
    }
  }
}

export function useStats(game: Game) {
  const stats = useMemo(() => new Stats(), [game]);
  const { score } = config;

  let lastY = Infinity;

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