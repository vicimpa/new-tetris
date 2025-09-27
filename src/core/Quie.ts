import { array } from "&utils/array";
import { signal } from "@preact/signals";

export class Quie<T> {
  readonly raw: T[];
  readonly v = signal(0);

  constructor(size: number, private _fn: () => T) {
    this.raw = array(size, _fn);
  }

  get(i: number) {
    this.v.value;
    return this.raw[i];
  }

  pop() {
    const elem = this.raw.pop();
    this.raw.unshift(this._fn());
    this.v.value++;
    return elem;
  }

  shift() {
    const elem = this.raw.shift();
    this.raw.push(this._fn());
    this.v.value++;
    return elem;
  }
}