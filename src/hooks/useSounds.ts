import { Game } from "&core/Game";
import { Stats } from "&core/Stats";
import { sound } from "&sound";
import { dispose } from "&utils/function";
import { clamp } from "&utils/math";
import { useEffect } from "preact/hooks";

export function useSounds(game: Game, stats: Stats) {
  useEffect(() => (
    dispose(
      game.subscribeMany({
        pause(isStop) {
          sound(!isStop ? 'pause' : 'unpause');
        },
        move(_x, _y, moved) {
          moved && sound('move');
        },
        rotate(has) {
          sound(has ? 'rotate' : 'norotate');
        },
        loose() {
          sound('loose');
        },
        hold(holded) {
          holded && sound('hold');
        },
        restart() {
          sound('pause');
        }
      }),
      stats.subscribeMany({
        fix() {
          sound('fix');
        },
        drop(count, combo) {
          combo && sound(`c${clamp(combo * +!!count, 0, 3)}`);
          count && sound('drop');
        },
      })
    )
  ));
}