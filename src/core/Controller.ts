import { Game } from "./Game";
import { keyPress, keysAxis, type KeyPressOptions } from "&utils/keyboard";
import { prop, reactive } from "@vicimpa/decorators";
import { signalPackedStore } from "&utils/signals";
import { t } from "@vicimpa/data-pack";

const store = await signalPackedStore('controlls', t.obj({
  moveLeftKey: t.array(t.str()),
  moveRightKey: t.array(t.str()),
  softDropKey: t.array(t.str()),
  hardDropKey: t.array(t.str()),
  rotateKey: t.array(t.str()),
  holdKey: t.array(t.str()),
}), {
  moveLeftKey: ['ArrowLeft', 'KeyA'],
  moveRightKey: ['ArrowRight', 'KeyD'],
  softDropKey: ['ArrowDown', 'KeyS'],
  hardDropKey: ['Space', 'KeyX'],
  rotateKey: ['ArrowUp', 'KeyW'],
  holdKey: ['Enter', 'KeyC']
});

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

  @prop moveLeftKey = store.value.moveLeftKey;
  @prop moveRightKey = store.value.moveRightKey;
  @prop softDropKey = store.value.softDropKey;
  @prop hardDropKey = store.value.hardDropKey;
  @prop rotateKey = store.value.rotateKey;
  @prop holdKey = store.value.holdKey;

  controll(game: Game) {
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

  save() {
    store.value = {
      moveLeftKey: this.moveLeftKey,
      moveRightKey: this.moveRightKey,
      rotateKey: this.rotateKey,
      hardDropKey: this.hardDropKey,
      softDropKey: this.softDropKey,
      holdKey: this.holdKey
    };
  }
}