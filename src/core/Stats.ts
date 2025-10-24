import { prop, reactive } from "@vicimpa/decorators";
import { observe, Observer } from "./Observer";
import { signalPackedStore } from "&utils/signals";
import { t } from "@vicimpa/data-pack";

export const hiscoreStore = await signalPackedStore('hiscore', t.uint(), 0);

@reactive()
export class Stats extends Observer {
  @prop score = 0;
  @prop lines = 0;
  @prop fixed = 0;
  @prop combo = 0;
  hiscore = hiscoreStore.peek();

  @observe
  add(score: number) {
    this.score += score;
  }

  @observe
  fix() {
    this.fixed++;
  }

  @observe
  drop(count: number) {
    this.lines += count;
    try {
      if (!count && this.combo < 2)
        this.combo = 0;
      return this.combo;
    } finally {
      if (count) this.combo++;
      else this.combo = 0;
    }
  }
}

