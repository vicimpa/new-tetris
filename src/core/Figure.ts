import { clone } from "&utils/clone";
import { mod } from "&utils/math";
import { range } from "&utils/range";
import { Matrix } from "./Matrix";
import { Rect } from "./Rect";

function rotate(r: number, x: number, y: number, n: number) {
  switch (r) {
    case 0: return [x, y] as const;
    case 1: return [n - 1 - y, x] as const;
    case 2: return [n - 1 - x, n - 1 - y] as const;
    case 3: return [y, n - 1 - x] as const;
    default: throw new Error('Invalid rotation');
  }
}

export class Figure extends Matrix {
  static readonly colors: string[] = [];

  private _rotation = 0;

  get rotation() { return this._rotation; }

  constructor(public readonly size: number) {
    super(size, size);
  }

  collide(dX: number, dY: number, matrix: Matrix) {
    for (const x of range(this.size)) {
      for (const y of range(this.size)) {
        const v = this.get(x, y);
        if (!v) continue;
        if (
          false
          || dX + x < 0
          || dY + y < 0
          || dX + x > matrix.width - 1
          || dY + y > matrix.height - 1
        ) return true;

        if (matrix.get(dX + x, dY + y))
          return true;
      }
    }
    return false;
  }

  color(color: string) {
    const id = Figure.colors.push(color);
    return this.fill((v) => v && id);
  }

  rotate(d: number) {
    const copy = structuredClone(this.raw);
    this._rotation = mod(this._rotation + d, 4);

    this.fill((_, x, y) => {
      const [rx, ry] = rotate(mod(d, 4), x, y, this.size);
      return copy[ry][rx];
    });

    return this;
  }

  rect() {
    const rect = new Rect();
    this.each((v, x, y) => {
      if (!v) return;
      rect.limit(x, y);
    });
    return rect;
  }
}

export function figure(...rows: string[]) {
  const size = Math.max(
    rows.length,
    ...rows.map(e => e.length)
  );

  return new Figure(size).fill((_, x, y) => (
    +(rows[size - 1 - y]?.[x] === '#')
  ));
}