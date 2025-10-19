import { Game } from "&core/Game";
import { useEffect, useMemo, useState } from "react";
import { useLooper } from "./useLooper";


export function useGame() {
  const [state, setState] = useState({});
  const game = useMemo(() => new Game(), [state]);

  useEffect(() => (
    game.setNow(),
    game.subscribe('restart', () => setState({}))
  ), [game]);

  useLooper(delta => game.update(delta));

  return game;
}