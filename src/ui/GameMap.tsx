import { Game } from "&core/Game";
import { colors } from "&data/colors";
import { Canvas } from "./Canvas";
import { Particles } from "./Particles";

export type GameMapProps = {
  game: Game;
  size?: number;
  showY?: number;
};

export const GameMap = ({ game, size = 25, showY = 20 }: GameMapProps) => {
  return (
    <div className="map" style={{ width: game.width * size, height: showY * size }}>
      <Canvas
        width={game.width * size}
        height={game.height * size}
        draw={ctx => {
          ctx.resetTransform();
          ctx.clearRect(0, 0, ctx.width, ctx.height);
          ctx.transform(1, 0, 0, -1, 0, game.height * size);

          // Draw grid
          game.map.each((v, x, y) => {
            if (y >= 20) return;

            ctx.drawGrid(x, y, size, getComputedStyle(ctx.canvas).stroke ?? '#555');
          });

          // Draw map
          game.map.each((v, x, y) => {
            if (!v) return;
            ctx.drawBlock(x, y, size, colors[v - 1] ?? '#000');
          });

          // Draw helper
          game.now?.each((v, x, y) => {
            if (!v) return;
            ctx.filter = 'drop-shadow(0 0 10px #fff)';
            ctx.drawGrid(x + game.x, y + game.lastY, size, '#ffffff', 1);
            ctx.filter = 'none';
            // ctx.drawGrid(x + game.x, y + game.lastY, size, colors[v - 1] ?? '#fff', 1, 4);
            // ctx.drawGrid(x + game.x, y + game.lastY, size, '#6e6c6c', 1, 4);
            // ctx.drawBlock(x + game.x, y + game.lastY, size, '#fff', .4);
          });

          // Draw now
          game.now?.each((v, x, y) => {
            if (!v) return;
            ctx.drawBlock(x + game.x, y + game.y, size, colors[v - 1] ?? '#000');
          });
        }}
      />
      <Particles padding={1000} size={size} game={game} showY={showY} />
    </div>
  );
};