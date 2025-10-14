import { useSignals } from "@preact/signals-react/runtime";
import { FigureView } from "./FigureView";
import type { Game } from "&core/Game";
import type { FC } from "react";

export type HoldViewProps = {
  game: Game;
};

export const HoldView: FC<HoldViewProps> = ({ game }) => {
  useSignals();

  return (
    <FigureView
      figure={game.holded}
      opacity={game.canHold ? 1 : .1}
      color={game.canHold ? undefined : '#fff'} />
  );
};