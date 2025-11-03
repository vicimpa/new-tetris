import type { Game } from "&core/Game";
import { Show } from "@preact/signals-react/utils";
import { PopupView } from "./Popup";
import { Settings } from "./Settings";
import { computed } from "@preact/signals-react";
import type { FC } from "react";
import { real } from "@vicimpa/decorators";
import type { Controller } from "&core/Controller";

export type PauseProps = {
  game: Game;
  ctrl: Controller;
};

export const Pause: FC<PauseProps> = ({ game, ctrl }) => {
  return (
    <Show when={computed(() => game.isEnd || game.isStop)}>
      <PopupView>
        <div className="modal">
          <h4>{computed(() => game.isEnd ? 'Game over' : 'Pause (Esc)')}</h4>
          <hr />
          <button onClick={() => game.restart()}>
            Restart
          </button>
          <button onClick={() => game.restart(true)}>Next seed</button>
          <br />
          <Settings ctrl={ctrl} />
          <br />
          <Show when={real(game, 'isStop')}>
            <button onClick={() => game.pause()}>
              {computed(() => game.time ? 'Resume' : 'Play')}
            </button>
          </Show>
          <br />
          <a target="_blank" className="github" href="https://github.com/vicimpa/new-tetris">
            <i className="i-github" /> GitHub
          </a>
        </div>
      </PopupView>
    </Show>
  );
};