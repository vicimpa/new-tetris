import { signalPackedStore } from "&utils/signals";
import { effect, signal } from "@preact/signals-react";
import { t } from "@vicimpa/data-pack";

export const score = {
  move: 1,
  dash: 2,
  drop: [0, 100, 300, 700, 1200],
  clean: [0, 200, 400, 600, 800],
  combo: [1, 2, 4, 6, 8, 10]
};


const effectsStore = await signalPackedStore('effects', t.obj({
  shaker: t.float(),
  dash: t.float(),
  drop: t.float()
}), { shaker: 1, dash: 1, drop: 1 });

export const effects = {
  shaker: signal(effectsStore.value.shaker),
  dash: signal(effectsStore.value.dash),
  drop: signal(effectsStore.value.drop),
};

effect(() => {
  effectsStore.value = {
    shaker: effects.shaker.value,
    dash: effects.dash.value,
    drop: effects.drop.value,
  };
});