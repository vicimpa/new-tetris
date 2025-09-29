import { Game } from "&core/Game";
import { Stats } from "&core/Stats";
import { clamp } from "&utils/math";
import { computed, useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export type BigStatsProps = {
  stats: Stats;
};

const BigStats = ({ stats }: BigStatsProps) => {
  const drop = useSignal(0);
  const count = useSignal(0);
  const dropName = useComputed(() => ['', 'Signle', 'Double', 'Tripple', 'Quad'][drop.value]);
  const combo = useComputed(() => clamp(stats.combo - 1, 0, Infinity));

  useEffect(() => (
    stats.subscribeMany({
      drop(lines) {
        drop.value = lines;
        count.value++;
      }
    })
  ));

  return (
    <div class="big">
      <p key={computed(() => count.value)} class="drop">{dropName}</p>
      {computed(() => (
        <p
          class="combo"
          style={(
            combo.value > 0 ? {
              opacity: 1,
              transform: 'scale(1) translateY(0px)',
              color: '#fff',
              transition: '0s'
            } : {
              opacity: 0,
              transform: 'scale(.6) translateY(-30px)',
              color: '#f00',
              transition: '.2s',
            })}
        >
          Combo <b>x{combo}</b>
        </p>
      ))}
    </div>
  );
};

function pad(n: number, c: number) {
  return n.toString().padStart(c, '0');
}

function time(n: number) {
  const ms = (n % 1000) | 0;
  n = (n / 1000) | 0;

  const s = n % 60;
  n = (n / 60) | 0;

  const m = n % 60;
  const h = (n / 60) | 0;

  return (
    <span>
      {h > 0 && `${h}:`}
      {m > 0 && `${pad(m, +(h > 0) * 2)}:`}
      {pad(s, +(m > 0) * 2)}.<small>{pad(ms, 3)}</small>
    </span>
  );
}

function numeric(n: number) {
  n |= 0;

  let output = '';

  do {
    let seg = n % 1000;
    n /= 1000;
    n |= 0;
    output = (n ? ' ' + pad(seg, 3) : seg) + output;
  } while (n);

  return output;
}

export type StatsProps = {
  game: Game;
  stats: Stats;
};

export const StatsView = ({ game, stats }: StatsProps) => (
  <div class="stats">
    <BigStats stats={stats} />
    <p class="hiscore">Hiscore<br /><b>{computed(() => numeric(stats.hiscore))}</b></p>
    <p class="score">Score<br /><b>{computed(() => numeric(stats.score))}</b></p>
    <p class="time">Time<br /><b>{computed(() => time(game.time))}</b></p>
    <p class="lines">Lines<br /><b>{computed(() => numeric(stats.lines))}</b></p>
    <p class="fixed">Fixes<br /><b>{computed(() => numeric(stats.fixed))}</b></p>
  </div>
);