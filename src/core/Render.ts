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

  drawBlink(x: number, y: number, size: number, t: number, p = 1, o = 1) {
    const top = y * size;
    const bottom = top + size;
    const shineY = bottom - t * size;

    const grad = this.createLinearGradient(0, shineY - size * p, 0, shineY + size * p);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    this.globalAlpha = (1 - Math.abs(t - .5) * 2) * o;
    this.globalCompositeOperation = "lighter";
    this.fillStyle = grad;
    this.fillRect(x * size, y * size, size, size);
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