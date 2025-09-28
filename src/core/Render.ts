import { loadImage } from "&utils/image";
import boxSrc from "&img/box.svg";

const context = Symbol('context');

type Canvas = HTMLCanvasElement & {
  [context]?: CanvasRenderingContext2D | Render | null;
};

const box = await loadImage(boxSrc, 32, 32, true);

export class Render extends CanvasRenderingContext2D {
  get width() { return this.canvas.width; }
  set width(v) { this.canvas.width = v; }

  get height() { return this.canvas.height; }
  set height(v) { this.canvas.height = v; }

  drawGrid(x: number, y: number, size: number, color: string, opacity = 1, line = 1) {
    this.globalAlpha = opacity;
    this.strokeStyle = color;
    this.lineWidth = line;
    this.strokeRect(x * size, y * size, size, size);
  }

  drawBlock(x: number, y: number, size: number, color: string, opacity = 1) {
    this.globalAlpha = opacity;
    this.fillStyle = color;
    this.fillRect(x * size, y * size, size, size);
    this.drawImage(box, x * size, y * size, size, size);
  }

  static fromCanvas(can?: Canvas | null): Render | undefined {
    let ctx: CanvasRenderingContext2D | null | undefined = null, proto = this.prototype;
    return can?.[context] ?? (
      ctx = can?.getContext('2d'),
      can && (
        can[context] = (
          ctx && Object.setPrototypeOf(ctx, proto)
        )
      )
    );
  }
}