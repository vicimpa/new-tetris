import { loadImage } from "&utils/image";
import boxSrc from "&img/box.svg";
import { makeStore } from "&utils/store";

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

  fromPath(fn: Function) {
    this.beginPath();
    fn();
    this.closePath();
  }

  fromFilter(filter: string, fn: Function) {
    this.filter = filter;
    fn();
    this.filter = 'none';
  }

  static fromCanvas = makeStore((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    return Object.setPrototypeOf(ctx, Render.prototype) as Render;
  });
}