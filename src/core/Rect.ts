export class Rect {
  private _top = Infinity;
  private _left = Infinity;
  private _right = -Infinity;
  private _bottom = -Infinity;

  get x() { return this._left; }
  get y() { return this._top; }
  get top() { return this._top; }
  get left() { return this._left; }
  get right() { return this._right; }
  get bottom() { return this._bottom; }
  get width() { return this._right - this._left + 1; }
  get height() { return this._bottom - this._top + 1; }

  limit(x: number, y: number) {
    this._top = Math.min(y, this._top);
    this._left = Math.min(x, this._left);
    this._right = Math.max(x, this._right);
    this._bottom = Math.max(y, this._bottom);
  }
}