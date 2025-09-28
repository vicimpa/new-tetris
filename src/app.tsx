import { useGame } from "&core/Game";
import { useStats } from "&core/Stats";
import { useShaker } from "&hooks/useShaker";
import { useSounds } from "&hooks/useSounds";
import { FigureView } from "&ui/FigureView";
import { GameMap } from "&ui/GameMap";
import { PopupView } from "&ui/Popup";
import { Menu } from "&ui/Menu";
import { StatsView } from "&ui/StatsView";
import { array } from "&utils/array";
import { computed } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { real } from "@vicimpa/decorators";
import { useEffect } from "preact/hooks";
import { Settings } from "&ui/Settings";

export const App = () => {
  const game = useGame();
  const stats = useStats(game);
  const ref = useShaker(game);

  useSounds(game, stats);
  useEffect(() => { game.pause(); }, []);

  return (
    <div class="game" ref={ref}>
      <div class="side left">
        <p>Hold</p>
        <FigureView
          figure={real(game, 'holded')}
          opacity={computed(() => game.canHold ? 1 : .1)}
          color={computed(() => game.canHold ? undefined : '#fff')} />
      </div>
      <div class="content">
        <GameMap size={25} game={game} />
        <StatsView game={game} stats={stats} />
        <Show when={computed(() => game.isEnd || game.isStop)}>
          <PopupView>
            <div class="modal">
              <h4>{computed(() => game.isEnd ? 'Game over' : 'Pause (Esc)')}</h4>
              <hr />
              <button onClick={() => game.restart()}>
                Restart
              </button>
              <button onClick={() => game.restart(true)}>Next seed</button>
              <br />
              <Settings />
              <br />
              <Show when={real(game, 'isStop')}>
                <button onClick={() => game.pause()}>
                  {computed(() => game.time ? 'Resume' : 'Play')}
                </button>
              </Show>
              <br />
              <a target="_blank" class="github" href="https://github.com/vicimpa/new-tetris">
                <i class="i-github" /> GitHub
              </a>
            </div>
          </PopupView>
        </Show>
      </div>
      <div class="side right">
        <p>Next</p>
        <div class="stack">
          {array(game.queue.size, (i) => (
            <FigureView clip figure={computed(() => game.queue.get(i))} />
          ))}
        </div>
      </div>
    </div >
  );
};