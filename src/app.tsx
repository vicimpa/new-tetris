import { useGame } from "&core/Game";
import { useStats } from "&core/Stats";
import { useShaker } from "&hooks/useShaker";
import { useSounds } from "&hooks/useSounds";
import { FigureView } from "&ui/FigureView";
import { GameMap } from "&ui/GameMap";
import { PopupProvider } from "&ui/Popup";
import { StatsView } from "&ui/StatsView";
import { array } from "&utils/array";
import { computed } from "@preact/signals-react";
import { real } from "@vicimpa/decorators";
import { Helps } from "&ui/Helps";
import { useController } from "&core/Controller";
import { Pause } from "&ui/Pause";

export const App = () => {
  const game = useGame();
  const stats = useStats(game);
  const ref = useShaker(game);
  const ctrl = useController(game);

  useSounds(game, stats);

  return (
    <div className="game" ref={ref}>
      <PopupProvider>
        <div className="side left">
          <p>Hold</p>
          <FigureView
            figure={real(game, 'holded')}
            opacity={computed(() => game.canHold ? 1 : .1)}
            color={computed(() => game.canHold ? undefined : '#fff')} />
        </div>
        <div className="content">
          <GameMap size={25} game={game} />
          <StatsView game={game} stats={stats} />
          <Helps />
          <Pause game={game} />
        </div>
        <div className="side right">
          <p>Next</p>
          <div className="stack">
            {array(game.queue.size, (i) => (
              <FigureView key={i} clip figure={computed(() => game.queue.get(i))} />
            ))}
          </div>
        </div>
      </PopupProvider>
    </div >
  );
};