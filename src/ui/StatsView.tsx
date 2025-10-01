import { Game } from "&core/Game";
import { Stats } from "&core/Stats";
import { useLooper } from "&hooks/useLooper";
import { clamp } from "&utils/math";
import { computed, useComputed, useSignal } from "@preact/signals-react";
import { useEffect, useRef, type FC, type ReactNode } from "react";

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
    <div className="big">
      <p className="drop">{dropName}</p>
      {computed(() => (
        <p
          className="combo"
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

const Value: FC<{ calc: () => any; }> = ({ calc }) => {
  const value = useComputed(() => String(calc()));
  const ref = useRef<HTMLElement>(null);
  useLooper(() => {
    if (!ref.current)
      return;

    if (ref.current.innerText !== value.value)
      ref.current.innerText = value.value;
  });
  return <b ref={ref} />;
};

export const StatsView = ({ game, stats }: StatsProps) => (
  <div className="stats">
    <BigStats stats={stats} />
    <p className="hiscore">Hiscore<br /><Value calc={() => numeric(stats.hiscore)} /></p>
    <p className="score">Score<br /><Value calc={() => numeric(stats.score)} /></p>
    <p className="time">Time<br /><b>{computed(() => time(game.time))}</b></p>
    <p className="lines">Lines<br /><Value calc={() => numeric(stats.lines)} /></p>
    <p className="fixed">Fixes<br /><Value calc={() => numeric(stats.fixed)} /></p>
  </div>
);