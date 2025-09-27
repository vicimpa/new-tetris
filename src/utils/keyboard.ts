import { nextTick } from "./async";

const DOWN = new Set<string>();
const PRESS = new Set<string>();
const TIMEOUT = new Map<string, number>();
const PEEK = new Set<(r: string) => void>();

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
  PRESS.delete(code);
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

export function keyPress(code: string | string[], every?: number) {
  if (Array.isArray(code))
    return code.findIndex(keyPress) !== -1;

  if (DOWN.has(code)) {
    if (!PRESS.has(code)) {

      nextTick(() => {
        PRESS.add(code);
        clearTimeout(TIMEOUT.get(code));
        if (every !== undefined)
          TIMEOUT.set(code, setTimeout(() => {
            PRESS.delete(code);
          }, every));
      });

      return true;
    }

    return false;
  }

  return false;
}

export function keyPressAll(codes: string[]) {
  return codes.every(keyPress);
}

export function keysAxis(neg: string | string[], pos: string | string[]) {
  return -keyDown(neg) + +keyDown(pos);
}

export function keysAxisAll(neg: string[], pos: string[]) {
  return -keysDownAll(neg) + +keysDownAll(pos);
}