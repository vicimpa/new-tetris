import { Game } from "&core/Game";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { Canvas } from "./Canvas";
import { Render } from "&core/Render";
import { range } from "&utils/range";
import { colors } from "&data/colors";
import { Figure } from "&core/Figure";

export type ParticlesProps = {
  size: number;
  game: Game;
  showY: number;
};

class Point {
  constructor(readonly data: Set<Point>) {
    this.data.add(this);
  }

  x = 0;
  y = 0;

  moveX = 0;
  moveY = 0;

  factorX = 0;
  factorY = 0;
  gravity = 0;

  time = 0;
  totalTime = 0;
  size = 1;

  color = '#fff';

  update(delta: number) {
    this.time += delta;
    if (this.time > this.totalTime) {
      this.data.delete(this);
      return;
    }

    this.moveX *= this.factorX;
    this.moveY *= this.factorY;
    this.moveY -= delta * this.gravity;

    this.x += this.moveX * delta * .001;
    this.y += this.moveY * delta * .001;
  }

  render(ctx: Render) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1 - (this.time / this.totalTime);
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  static dropRow(items: Set<Point>, size: number, y: number, row: number[]) {
    row.forEach((v, x) => {
      for (const _ of range(Math.random() * 100 + 100)) {
        const point = new Point(items);
        point.x = Math.random() * size + x * size;
        point.y = Math.random() * size + y * size;
        point.moveX = (Math.random() * 2 - 1) * 1000;
        point.moveY = (Math.random() * 2) * 1000;
        point.factorX = .94;
        point.factorY = .96;
        point.gravity = 3;
        point.size = 6;
        point.totalTime = (Math.random() * 300 + 100);
        point.color = colors[v - 1] ?? '#fff';
      }
    });
  }

  static dropFigure(items: Set<Point>, size: number, dX: number, sY: number, eY: number, figure: Figure) {
    figure.each((v, x, y) => {
      if (!v) return;
      for (const dY of range(sY, eY)) {
        for (const _ of range(5)) {
          const point = new Point(items);
          point.x = Math.random() * size + (x + dX) * size;
          point.y = Math.random() * size + (y + dY) * size;
          point.moveX = (Math.random() * 2 - 1) * 50;
          point.moveY = (Math.random() * -2) * 100;
          point.factorX = .94;
          point.factorY = .96;
          // point.gravity = 10;
          point.size = 3;
          point.totalTime = (Math.random() * 200 + 200);
          point.color = colors[v - 1] ?? '#fff';
        }
      }
    });
  }
}

export const Particles = ({ size, game, showY }: ParticlesProps) => {
  const items = useMemo(() => new Set<Point>(), []);

  useEffect(() => (
    game.subscribeMany({
      dropLines(lines) {
        lines.forEach((row, y) => {
          Point.dropRow(items, size, y, row);
        });
      },
      dash([fig, x, y]) {
        fig && Point.dropFigure(items, size, x, this.lastY, y, fig);
      },
    })
  ));

  return (
    <Canvas
      width={game.map.width * size}
      height={showY * size}
      class="particles"
      loop={(ctx, delta) => {
        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.transform(1, 0, 0, -1, 0, ctx.height);
        items.forEach(p => p.update(delta));
        items.forEach(p => p.render(ctx));
      }}
    />
  );
};