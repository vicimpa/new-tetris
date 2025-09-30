import { Game } from "&core/Game";
import { useEffect } from "react";
import { Canvas } from "./Canvas";
import { colors } from "&data/colors";
import { Figure } from "&core/Figure";
import { useParticleSystem } from "&hooks/useParticleSystem";
import { rand } from "&utils/math";
import { vec2 } from "@vicimpa/glm";

export type ParticlesProps = {
  size: number;
  game: Game;
  showY: number;
  padding?: number;
};

export const Particles = ({ size, game, showY, padding = 0 }: ParticlesProps) => {
  const figure = useParticleSystem(
    (figure: Figure, x: number, y: number, ey: number) => {
      let blockSize = 2;
      let time = rand(300, 600), start = time;
      let { width, left } = figure.rect();
      let pos = vec2(x + rand(width + left), y + rand(ey - y)).scale(size).sub(blockSize / 2);
      let move = vec2(rand(-100, 100), rand(100, 600));

      return (ctx, dt) => {
        if ((time -= dt) < 0) return false;
        move.scale(.99);
        pos.scaleAdd(move, .001 * dt);
        ctx.globalAlpha = time / start / 2;
        ctx.fillStyle = '#fff';
        ctx.fillRect(pos.x, pos.y, blockSize, blockSize);
      };
    }
  );

  const line = useParticleSystem(
    (x: number, y: number, color: string) => {
      let blockSize = 8;
      let time = rand(500, 1000), start = time;
      let pos = vec2(x + rand(1), y + rand(1)).scale(size).sub(blockSize / 2);
      let move = vec2(rand(-500, 500), rand(2000));

      return (ctx, dt) => {
        if ((time -= dt) < 0) return false;
        move.scale(.99);
        move.y -= 3 * dt;
        pos.scaleAdd(move, .001 * dt);
        ctx.globalAlpha = time / start;
        ctx.fillStyle = color;
        ctx.fillRect(pos.x, pos.y, blockSize, blockSize);
      };
    }
  );

  useEffect(() => (
    game.subscribeMany({
      dropLines(lines) {
        lines.forEach((row, y) => {
          row.forEach((val, x) => {
            line.spawn(rand(size), x, y, colors[val - 1] ?? '#fff');
          });
        });
      },
      dash([fig, x, y]) {
        if (!fig) return;
        const count = rand(1, 5) * fig.size * 10;
        figure.spawn(count, fig, x, y, game.lastY);
      },
    })
  ), [game]);

  return (
    <Canvas
      style={{ left: -padding, bottom: -padding }}
      width={game.map.width * size + padding * 2}
      height={showY * size + padding * 2}
      loop={(ctx, delta) => {
        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.transform(1, 0, 0, -1, padding, ctx.height - padding);
        figure.render(ctx, delta);
        line.render(ctx, delta);
      }}
    />
  );
};