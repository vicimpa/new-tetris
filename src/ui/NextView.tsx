import type { Game } from "&core/Game";
import { array } from "&utils/array";
import type { FC } from "react";
import { FigureView } from "./FigureView";
import { useSignals } from "@preact/signals-react/runtime";

export type NextViewProps = {
  game: Game;
};

export const NextView: FC<NextViewProps> = ({ game }) => {
  useSignals();

  return (
    <div className="stack">
      {
        array(game.queue.size, (i) => (
          <FigureView
            key={i}
            clip
            figure={game.queue.get(i)} />
        ))
      }
    </div>
  );
};