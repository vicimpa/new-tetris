import { clone } from "&utils/clone";
import { range } from "&utils/range";
import { Matrix } from "./Matrix";

export class Figure extends Matrix {
  static readonly colors: string[] = [];

  constructor(public readonly size) {
    super(size, size);
  }

  rect() {
    let sx = Infinity, sy = Infinity, ex = -Infinity, ey = -Infinity;
    this.each((v, x, y) => {
      if (!v) return;
      sx = Math.min(x, sx);
      sy = Math.min(y, sy);
      ex = Math.max(x + 1, ex);
      ey = Math.max(y + 1, ey);
    });

    return new DOMRect(sx, sy, ex - sx, ey - sy);
  }

  collide(dX: number, dY: number, matrix: Matrix) {
    for (const X of range(this.size)) {
      for (const Y of range(this.size)) {
        if (!this.get(X, Y))
          continue;

        let x = X + dX;
        let y = Y + dY;

        if (
          false
          || x < 0
          || x > matrix.width - 1
          || y > matrix.height - 1
          || matrix.get(x, y) > 0
        ) return true;
      }
    }
    return false;
  }

  color(color: string) {
    const id = Figure.colors.push(color);
    return this.fill((v) => v && id);
  }

  rotate(d: number) {
    d |= 0;

    if (!d) return this;
    const sign = Math.sign(d);

    do {
      const copy = clone(this);

      for (const x of range(this.size)) {
        for (const y of range(this.size)) {
          if (sign > 0)
            this.set(y, x, copy.get(x, this.size - 1 - y));
          if (sign < 0)
            this.set(y, x, copy.get(this.size - 1 - x, y));
        }
      }
    } while (d -= sign);

    return this;
  }
}

export function figure(...rows: string[]) {
  const size = Math.max(
    rows.length,
    ...rows.map(e => e.length)
  );

  return new Figure(size).fill((_, x, y) => (
    +(rows[y]?.[x] === '#')
  ));
}