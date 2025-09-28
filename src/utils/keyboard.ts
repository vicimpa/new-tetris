import { nextTick } from "./async";

const DOWN = new Set<string>();
const PRESS = new Set<string>();
const TIMEOUT = new Map<string, number>();
const PEEK = new Set<(r: string) => void>();
const COUNT = new Map<string, number>();

addEventListener('keydown', ({ code, repeat }) => {
  if (repeat) return;
  if (PEEK.size) {
    [...PEEK].forEach(e => e(code));
    PEEK.clear();
    return;
  }
  DOWN.add(code);
});

addEventListener('keyup', ({ code }) => {
  DOWN.delete(code);
});

addEventListener('blur', () => {
  DOWN.clear();
  PRESS.clear();
  TIMEOUT.clear();
});

export function keyPeek() {
  return new Promise<string>((r) => PEEK.add(r));
}

export function keyDown(code: string | string[]) {
  if (Array.isArray(code))
    return code.findIndex(keyDown) !== -1;

  return DOWN.has(code);
}

export function keysDownAll(codes: string[]) {
  return codes.every(keyDown);
}

export function keyPress(code: string | string[], every?: number, skip = 0) {
  const key = String(code);
  const count = COUNT.get(key) ?? 0;
  if (keyDown(code)) {
    if (!PRESS.has(key)) {
      nextTick(() => {
        PRESS.add(key);
        clearTimeout(TIMEOUT.get(key));
        if (every !== undefined)
          TIMEOUT.set(key, setTimeout(() => {
            PRESS.delete(key);
          }, every));
      });

      COUNT.set(key, count + 1);
      return count === 0 || count > skip;
    }

    return false;
  }
  PRESS.delete(key);
  COUNT.delete(key);
  return false;
}

export function keyPressAll(codes: string[], every?: number, skip?: number) {
  return codes.every(e => keyPress(e, every, skip));
}

export function keysAxis(neg: string | string[], pos: string | string[]) {
  return -keyDown(neg) + +keyDown(pos);
}

export function keysAxisAll(neg: string[], pos: string[]) {
  return -keysDownAll(neg) + +keysDownAll(pos);
}