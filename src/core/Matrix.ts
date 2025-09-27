import { array } from "&utils/array";
import { range } from "&utils/range";

export class Matrix {
  readonly raw: number[][];

  constructor(public readonly width: number, public readonly height: number) {
    this.raw = array(height, () => array(height, 0));
  }

  get(x: number, y: number) {
    return this.raw[y]?.[x] ?? 0;
  }

  set(x: number, y: number, v: number) {
    if (this.raw[y]?.[x] !== undefined) {
      this.raw[y][x] = v;
      return true;
    }
    return false;
  }

  setMatrix(x: number, y: number, v: Matrix) {
    let outside = false;

    v.each((v, dX, dY) => {
      if (!v) return;
      if (!this.set(x + dX, y + dY, v))
        outside = true;
    });

    return outside;
  }

  getRow(y: number) {
    return array(this.width, x => this.get(x, y));
  }

  setRow(y: number, data: number[]) {
    for (const x of range(this.width)) {
      if (data[x] !== undefined)
        this.set(x, y, data[x]);
    }
  }

  getCol(x: number) {
    return array(this.height, y => this.get(x, y));
  }

  setCol(x: number, data: number[]) {
    for (const y of range(this.height)) {
      if (data[y] !== undefined)
        this.set(x, y, data[x]);
    }
  }

  each(fn: (v: number, x: number, y: number) => any) {
    for (const x of range(this.width)) {
      for (const y of range(this.height)) {
        fn(this.get(x, y), x, y);
      }
    }

    return this;
  }

  fill(fn: number | ((v: number, x: number, y: number) => number)) {
    if (typeof fn !== 'function') {
      const value = fn;
      fn = () => value;
    }

    return this.each((v, x, y) => this.set(x, y, fn(v, x, y)));
  }

  dropRow(y: number, up = true) {
    if (!this.raw[y])
      return false;

    this.raw.splice(y, 1);
    const row = this.getCol(-1);

    if (up)
      this.raw.unshift(row);
    else
      this.raw.push(row);
  }
}