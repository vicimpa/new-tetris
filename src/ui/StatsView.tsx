import { Game } from "&core/Game";
import { Stats } from "&core/Stats";
import { clamp } from "&utils/math";
import { Unsignal } from "&utils/signals";
import { computed, useComputed, useSignal } from "@preact/signals";
import { HTMLAttributes } from "preact";
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
              transform: 'scale(3) translateY(-30px)',
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
  let ms = (n % 1000) | 0;
  n /= 1000;
  if (n < 60) return (<>{n | 0}<small> {pad(ms, 3)} s</small></>);
  let s = (n % 60) | 0;
  n /= 60;
  if (n < 60) return (<>{n | 0}<small> {pad(s, 2)} m</small></>);
  let m = (n % 60) | 0;
  n /= 60;
  return (<>{(n | 0)}<small> {pad(m, 2)} h</small></>);
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
    <p class="score">Score<br /><b>{computed(() => numeric(stats.score))}</b></p>
    <p class="lines">Lines<br /><b>{computed(() => numeric(stats.lines))}</b></p>
    <p class="fixed">Fixes<br /><b>{computed(() => numeric(stats.fixed))}</b></p>
    <p class="time">Time<br /><b>{computed(() => time(game.time))}</b></p>
  </div>
);