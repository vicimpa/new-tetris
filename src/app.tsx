
import { useShaker } from "&hooks/useShaker";
import { useSounds } from "&hooks/useSounds";
import { GameMap } from "&ui/GameMap";
import { PopupProvider } from "&ui/Popup";
import { StatsView } from "&ui/StatsView";
import { Helps } from "&ui/Helps";
import { useController } from "&core/Controller";
import { Pause } from "&ui/Pause";
import { HoldView } from "&ui/HoldView";
import { NextView } from "&ui/NextView";
import { useGame } from "&hooks/useGame";
import { useStats } from "&hooks/useStats";

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
          <HoldView game={game} />
        </div>
        <div className="content">
          <GameMap size={25} game={game} />
          <StatsView game={game} stats={stats} />
          <Helps ctrl={ctrl} />
          <Pause game={game} />
        </div>
        <div className="side right">
          <p>Next</p>
          <NextView game={game} />
        </div>
      </PopupProvider>
    </div >
  );
};