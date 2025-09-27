import { Figure } from "&core/Figure";
import { Matrix } from "&core/Matrix";
import { Quie } from "&core/Quie";
import { colors } from "&data/colors";
import { getFigure } from "&data/figures";
import { useLooper } from "&hooks/useLooper";
import { Canvas } from "&ui/Canvas";
import { array } from "&utils/array";
import { clone } from "&utils/clone";
import { keyPress } from "&utils/keyboard";
import { range } from "&utils/range";
import { computed, effect, signal, Signal, useSignalEffect } from "@preact/signals";
import boxSrc from "./img/box.svg";
import { useEffect, useRef } from "preact/hooks";
import { sound } from "&sound";
import { delay } from "&utils/async";
import { config } from "&data/config";
import { clamp } from "&utils/math";
import { For, Show } from "@preact/signals/utils";
import { useReload } from "&hooks/useReload";
import { SelectKey } from "&ui/SelectKey";
import { nextSeed, restart } from "&data/random";
import { useShaker } from "&hooks/useShaker";

const size = 25;
const box = new Image(32, 23);
box.src = boxSrc;

function grid(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = '#555';
  ctx.strokeRect(x, y, 1, 1);
}

function block(ctx: CanvasRenderingContext2D, x: number, y: number, v: number) {
  if (!v) return;
  ctx.fillStyle = colors[v - 1] ?? '#fff';
  ctx.fillRect(x, y, 1, 1);
  ctx.drawImage(box, x, y, 1, 1);
}

function drawFigure(figure: Signal<Figure | null | undefined>, opacity = signal(1)) {
  return (ctx: CanvasRenderingContext2D) => {
    const { value } = figure;
    ctx.clearRect(0, 0, 4, 4);
    if (!value) return;
    const rect = value.rect();
    const dx = 2 - rect.x - rect.width / 2;
    const dy = 2 - rect.y - rect.height / 2;
    ctx.globalAlpha = opacity.value;
    value.each((v, x, y) => block(ctx, x + dx, y + dy, v));
  };
}

const checks = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const hiscore = signal(+localStorage.getItem('score'));
const controls = signal(config.controls);

try {
  const raw = localStorage.getItem('controls');
  const data = JSON.parse(raw);
  if (!data && typeof data !== 'object')
    throw '';

  controls.value = Object.assign({}, config.controls, data);

  for (let key in config.controls) {
    if (typeof controls.value[key] !== config.controls[key])
      colors.values[key] = config.controls[key];
  }
} catch (e) { }

effect(() => {
  localStorage.setItem('controls', JSON.stringify(controls.value));
});

if (isNaN(hiscore.value))
  hiscore.value = 0;

effect(() => {
  localStorage.setItem('score', `${hiscore.value}`);
});

export const App = () => {
  restart();
  const width = 10;
  const height = 20;
  const next = new Quie(4, getFigure);
  const messages = useRef<HTMLDivElement | null>(null);
  const reload = useReload();
  const [shakerRef, shaker] = useShaker({ x: 0, y: 0, s: 0 }, (el, data) => {
    const sx = data.s * (Math.random() * 2 - 1);
    const sy = data.s * (Math.random() * 2 - 1);
    el.style.transform = `translateX(${data.x + sx}px) translateY(${data.y + sy}px)`;
  });

  let waitTime = 0;
  let combo = 0;

  const lastHiscore = hiscore.peek();
  const map = signal(new Matrix(10, 20));
  const canHold = signal(true);
  const end = signal(false);
  const stop = signal(true);
  const time = signal(0);
  const lines = signal(0);
  const fixes = signal(0);
  const score = signal(0);
  const showTime = computed(() => (time.value / 100).toFixed(2));

  const now = signal<Figure | null>(null);
  const hold = signal<Figure | null>(null);
  const x = signal(0);
  const y = signal(0);
  const lastY = computed(() => {
    if (!now.value) return -1;

    for (const nY of range(y.value, map.value.height)) {
      if (now.value.collide(x.value, nY, map.value)) {
        return nY - 1;
      }
    }
  });

  function dash() {
    const dist = lastY.value - y.value;
    score.value += config.score.dash * dist;
    y.value = lastY.value;
    fix();
  }

  function toHold() {
    if (!canHold.value) return sound('norotate');
    const { value } = now;
    if (!value) return sound('norotate');
    toNow(hold.value ?? next.shift());
    hold.value = value;
    canHold.value = false;
    sound('rotate');
  }

  async function drop() {
    const scoreConfig = config.score.drop;
    await delay(config.delay.drop);

    let count = 0, nowScore = 0;
    for (let y = height - 1; y >= 0; y--) {
      if (map.value.getRow(y).every(e => e > 0)) {
        const copy = clone(map.value);
        copy.dropRow(y++);
        map.value = copy;
        count++;
        const append = scoreConfig[count] ?? scoreConfig.at(-1);
        score.value += append - nowScore;
        nowScore += append;
        lines.value++;
        shaker.s += 20 * count;
        sound('drop');
        await delay(config.delay.drop);
      };
    }

    await delay(config.delay.drop);
    return count;
  }

  function fix() {
    if (!now.value) return;
    if (!map.value.setMatrix(x.value, y.value, now.value)) {
      now.value = null;
      canHold.value = true;
      fixes.value++;
      sound('fix');
      shaker.y += 30;
      drop()
        .then((drops) => {
          const { dropClear, drop } = config.score;
          if (map.value.raw.every(e => !e))
            score.value += dropClear[drops] ?? dropClear.at(-1);

          if (drops) {
            if (combo) {
              const factor = 2 ** combo;
              sound(`c${clamp(combo, 1, 3)}`);
              message(`Combo ${combo} (x${factor})`);
              setTimeout(() => {
                score.value += drop[drops] * factor;
              }, 100);
            }
            combo++;
          } else {
            combo = 0;
          }
          toNow(next.shift());
        });
      return true;
    } else {
      sound('loose');
      end.value = true;
      shaker.s = 150;
    }
  }

  function moveX(mX: number) {
    if (!now.value) return false;
    if (!now.value.collide(x.value + mX, y.value, map.value)) {
      x.value += mX;
      sound('move');
      return true;
    }
    shaker.x += mX * 5;
    sound('nomove');
    return false;
  }

  function moveY(mY: number) {
    if (!now.value) return false;
    if (!now.value.collide(x.value, y.value + mY, map.value)) {
      y.value += mY;
      waitTime = 0;
      score.value += config.score.move;
      sound('move');
      return true;
    }
    shaker.y += mY * 10;
    sound('nomove');
    return false;
  }

  function rotate(d = 1) {
    let copy = clone(now.value);
    copy.rotate(d);

    if (!copy.collide(x.value, y.value, map.value)) {
      now.value = copy;
      return sound('rotate');
    }

    for (const d of range(1, 3)) {
      for (const [mX, mY] of checks) {
        if (!copy.collide(d * mX + x.value, d * mY + y.value, map.value)) {
          now.value = copy;
          x.value += mX * d;
          y.value += mY * d;
          return sound('rotate');
        }
      }
    }

    sound('norotate');
  }

  function pause() {
    if (stop.value)
      sound('pause');
    else
      sound('unpause');
    stop.value = !stop.value;
  }

  function tick() {
    waitTime = 0;
    if (lastY.value === y.value) fix();
    else y.value++;
  }

  function toNow(figure: Figure) {
    const { y: dY, height: h } = figure.rect();
    y.value = -4;
    y.value += 4 - h - dY;
    x.value = Math.floor(width / 2 - figure.size / 2);
    now.value = figure;
  }

  function message(...args: any[]) {
    if (!messages.current) return;
    const msg = document.createElement('p');
    msg.onanimationend = () => msg.remove();
    msg.style.setProperty('--x', `${(Math.random() * 2 - 1) * 20}px`);
    msg.innerText = args.join(' ');
    messages.current.append(msg);
  }

  let lastScore = 0;

  useEffect(() => (
    effect(() => {
      let delta = score.value - lastScore;
      lastScore = score.value;

      if (hiscore.value < score.value)
        hiscore.value = score.value;
      if (delta)
        message(`+${delta}`);
    })
  ));

  useLooper((delta) => {
    if (end.value)
      return;

    if (keyPress('Escape')) pause();
    if (stop.value) return;
    if (!now.value) return waitTime = 0;

    time.value += delta;
    waitTime += delta;
    const { value: ctrl } = controls;

    if (keyPress(ctrl.dash)) dash();
    if (keyPress(ctrl.hold)) toHold();
    if (keyPress(ctrl.rotate, 140)) rotate();
    if (keyPress(ctrl.left, 100)) moveX(-1);
    if (keyPress(ctrl.right, 100)) moveX(+1);
    if (keyPress(ctrl.down, 50)) moveY(1);
    if (waitTime > 700) tick();
  });

  setTimeout(() => {
    toNow(next.shift());
  });

  return (
    <div class="game" ref={shakerRef}>
      <div class="side left">
        <p>Hold</p>
        <Canvas
          scale={20}
          width={4}
          height={4}
          draw={drawFigure(hold, computed(() => canHold.value ? 1 : .4))}
        />

        <p>Stats</p>
        <div class="status">
          <p><small>Time:</small> <b>{showTime}</b></p>
          <p><small>Score:</small> <b>{score}</b></p>
          <p><small>Hiscore:</small> <b>{lastHiscore}</b></p>
          <p><small>Fixes:</small> <b>{fixes}</b></p>
          <p><small>Lines:</small> <b>{lines}</b></p>
        </div>
      </div>
      <div class="content">
        <div class="message" ref={messages}></div>
        <Show when={stop}>
          <div class="modal">
            <h3>Pause (Esc)</h3>
            <table>
              <tbody>
                <For each={computed(() => Object.entries(controls.value))}>
                  {([key, value], i) => (
                    <tr key={i}>
                      <td>{key}</td>
                      <td>
                        <SelectKey
                          value={value}
                          onChange={(code) => {
                            controls.value = { ...controls.value, [key]: code };
                          }} />
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>

            <Show when={computed(() => !!time.value)}>
              <button onClick={reload}>restart</button>
            </Show>
          </div>
        </Show>


        <Show when={end}>
          <div class="modal">
            <h3>Game Over</h3>
            <h5>You score {score}</h5>
            <small>Hiscore {lastHiscore}</small>

            <Show when={computed(() => hiscore.value < lastScore)}>
              <h5>You have new record</h5>
            </Show>

            <button onClick={reload}>restart</button>
            <button onClick={() => { nextSeed(); reload(); }}>next seed</button>
          </div>
        </Show>
        <Canvas
          class="up"
          scale={size}
          width={width}
          height={4}
          draw={(ctx) => {
            ctx.clearRect(0, 0, width, 4);
            now.value?.each((v, fX, fY) => block(ctx, fX + x.value, fY + y.value + 4, v));
          }}
        />
        <Canvas
          scale={size}
          width={width}
          height={height}
          draw={(ctx) => {
            ctx.clearRect(0, 0, width, height);

            map.value.each((v, x, y) => {
              if (!v) return grid(ctx, x, y);
              block(ctx, x, y, v);
            });

            ctx.globalAlpha = .2;
            now.value?.each((v, fX, fY) => block(ctx, fX + x.value, fY + lastY.value, v && -1));

            ctx.globalAlpha = 1;
            now.value?.each((v, fX, fY) => block(ctx, fX + x.value, fY + y.value, v));

          }} />
      </div>
      <div class="side right">
        <p >Next</p>
        {
          array(4, (key) => (
            <Canvas
              scale={20}
              width={4}
              height={4}
              draw={drawFigure(computed(() => next.get(key)))}
            />
          ))
        }
      </div>
    </div>
  );
};