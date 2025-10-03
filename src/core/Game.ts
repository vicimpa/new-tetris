import { prop, reactive } from "@vicimpa/decorators";
import { Queue } from "./Queue";
import { getFigure } from "&data/figures";
import { nextSeed, restart } from "&data/random";
import { Figure } from "./Figure";
import { Matrix } from "./Matrix";
import { range } from "&utils/range";
import { clone } from "&utils/clone";
import { batch } from "@preact/signals-react";
import { observe, Observer } from "./Observer";
import { useEffect, useMemo, useState } from "react";
import { useLooper } from "&hooks/useLooper";

const VALIDATE_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;

@reactive()
export class Game extends Observer {
  readonly width = 10;
  readonly height = 30;

  queue = (restart(), new Queue(5, getFigure));

  @prop map = new Matrix(this.width, this.height);
  @prop now: Figure | null = null;
  @prop holded: Figure | null = null;
  @prop canHold = true;
  @prop currentMap = this.map;

  @prop isEnd = false;
  @prop isStop = false;
  @prop time = 0;
  @prop isLastY = false;
  @prop waitTime = 0;
  @prop tickDelay = 1000;
  @prop fixDelay = 500;

  @prop x = 0;
  @prop y = 0;

  @prop preview = {
    now: null as Figure | null,
    x: 0,
    y: 0,
  };

  @prop get lastY() {
    const { now, map, x, y } = this;
    if (!now) return 20;

    for (const nY of range(y, -4, -1, true)) {
      if (now.collide(x, nY, map)) {
        return nY + 1;
      }
    }

    return 20;
  }

  @observe
  setLastY(isLast: boolean) {
    this.waitTime = 0;
    this.isLastY = isLast;
  }

  @observe
  setNow(newNow: Figure = this.queue.shift()) {
    this.waitTime = 0;
    this.x = Math.floor(this.width / 2 - newNow.size / 2);
    for (const dY of range(20, 40)) {
      if (!newNow.collide(this.x, dY, this.map)) {
        this.y = dY;
        break;
      }
    }
    this.now = newNow;
    return true;
  }

  @observe
  move(moveX: number, moveY: number) {
    const { now, x, y, map } = this;
    if (!now || (!moveX && !moveY)) return false;
    if (!now.collide(x + moveX, y + moveY, map)) {
      this.x += moveX;
      this.y += moveY;
      if (moveY) this.waitTime = 0;
      return true;
    }
    return false;
  }

  @observe
  rotate(dir = 1) {
    const { now, x, y, map } = this;

    if (!now) return;

    let copy = clone(now);
    copy.rotate(dir);

    if (!copy.collide(x, y, map)) {
      this.now = copy;
      return true;
    }

    for (const d of range(1, 3)) {
      for (const [mX, mY] of VALIDATE_DIRS) {
        if (!copy.collide(d * mX + x, d * mY + y, map)) {
          this.now = copy;
          this.x += mX * d;
          this.y += mY * d;
          return true;
        }
      }
    }

    return false;
  }

  @observe
  loose() {
    this.isEnd = true;
  }

  @observe
  hold() {
    if (!this.canHold || !this.now) return false;
    const { now } = this;
    this.setNow(this.holded ?? undefined);
    this.holded = now;
    this.canHold = false;
    return true;
  }

  @observe
  dash() {
    try {
      return [this.now, this.x, this.y] as const;
    } finally {
      this.y = this.lastY;
      this.fix();
    }
  }

  @observe
  toMap(now: Figure, x: number, y: number) {
    this.now = null;
    this.canHold = true;
    this.waitTime = 0;
    this.map.setMatrix(x, y, now);
  }

  @observe
  checkLose() {
    let lose = false;
    this.map.each((v, _x, y) => {
      if (y < 20) return;
      if (v) lose = true;
    });
    return lose;
  }

  @observe
  tick() {
    this.waitTime = 0;
    this.y--;
  }

  @observe
  fix() {
    const { now, x, y } = this;
    if (!now) return false;
    this.toMap(now, x, y);
    this.drop();
    if (this.checkLose()) {
      this.loose();
    } else {
      this.setNow();
    }
  }

  @observe
  drop() {
    var map = this.map;
    let count = 0;

    for (const y of this.dropLines().keys()) {
      const copy = clone(map);
      copy.dropRow(y - count++);
      map = copy;
    }

    this.map = map;

    return count;
  }

  @observe
  dropLines() {
    const map = new Map<number, number[]>();

    for (let y = 0; y < this.map.height; y++) {
      const row = this.map.getRow(y);
      if (row.every(e => e > 0)) {
        map.set(y, row);
      };
    }

    return map;
  }

  @observe
  pause() {
    this.isStop = !this.isStop;
    return this.isStop;
  }

  @observe
  update(delta: number) {
    batch(() => {
      if (this.isEnd || this.isStop || !this.now)
        return void (this.waitTime = 0);

      this.time += delta;
      this.waitTime += delta;

      if (!this.isLastY && this.waitTime > this.tickDelay)
        this.tick();

      if (this.isLastY && this.waitTime > this.fixDelay)
        this.fix();

      if (!this.isLastY && this.y === this.lastY)
        this.setLastY(true);

      if (this.isLastY && this.y !== this.lastY)
        this.setLastY(false);
    });
  }

  @observe
  restart(regen = false) {
    if (regen) nextSeed();
  }
}

export function useGame() {
  const [state, setState] = useState({});
  const game = useMemo(() => new Game(), [state]);

  useEffect(() => (
    game.setNow(),
    game.subscribe('restart', () => setState({}))
  ), [game]);

  useLooper(delta => game.update(delta));

  return game;
}