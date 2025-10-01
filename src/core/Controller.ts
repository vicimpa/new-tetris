import { useEffect, useMemo } from "react";
import { Game } from "./Game";
import { useLooper } from "&hooks/useLooper";
import { keyPress, keysAxis, type KeyPressOptions } from "&utils/keyboard";
import { prop, reactive } from "@vicimpa/decorators";

@reactive()
export class Controller {
  @prop moveOptions: KeyPressOptions = {
    every: 20,
    skip: 6,
  };

  @prop dropOptions: KeyPressOptions = {
    every: 20,
    skip: 4,
  };

  @prop moveLeftKey: string | string[] = ['ArrowLeft', 'KeyA'];
  @prop moveRightKey: string | string[] = ['ArrowRight', 'KeyD'];
  @prop softDropKey: string | string[] = ['ArrowDown', 'KeyS'];
  @prop hardDropKey: string | string[] = ['Space', 'KeyX'];
  @prop rotateKey: string | string[] = ['ArrowUp', 'KeyW'];
  @prop holdKey: string | string[] = ['Enter', 'KeyC'];

  constructor(public game: Game) { }

  update() {
    const { game } = this;

    if (game.isEnd)
      return;

    if (keyPress('Escape'))
      game.pause();

    if (game.isStop)
      return;

    if (keyPress(this.hardDropKey))
      game.dash();

    if (keyPress(this.holdKey))
      game.hold();

    if (keyPress(this.rotateKey))
      game.rotate();

    if (keyPress([this.moveLeftKey, this.moveRightKey].flat(), this.moveOptions))
      game.move(keysAxis(this.moveLeftKey, this.moveRightKey), 0);

    if (keyPress(this.softDropKey, this.dropOptions))
      game.move(0, -1);
  }
}

export function useController(game: Game) {
  const ctrl = useMemo(() => new Controller(game), [game]);

  useEffect(() => { game.pause(); }, []);
  useLooper(() => ctrl.update());

  return ctrl;
}