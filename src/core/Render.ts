const context = Symbol('context');

export class Render extends CanvasRenderingContext2D {
  readonly currentScale: number = 1;

  get width() {
    return this.canvas.width / this.currentScale;
  }

  set width(v) {
    this.canvas.width = v * this.currentScale;
  }

  get height() {
    return this.canvas.height / this.currentScale;
  }

  set height(v) {
    this.canvas.height = v * this.currentScale;
  }

  static fromCanvas(can?: HTMLCanvasElement, scale: number = 1): Render | undefined {
    if (!can) return;
    if (can[context])
      return can[context];
    const ctx = can.getContext('2d');
    if (!ctx) return;
    return can[context] = Object.assign(
      Object.setPrototypeOf(ctx, this.prototype),
      { currentScale: scale }
    );
  }
}