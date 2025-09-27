import { ref } from "&utils/function";
import { makeRandom } from "&utils/random";

let seed = +location.hash.slice(1) | 0;
let nextSeedValue = Math.random() * 100000000 | 0;

export const random = ref(makeRandom(seed));

export const nextSeed = () => {
  location.hash = `#${seed = nextSeedValue}`;
  random.current = makeRandom(seed);
  nextSeedValue = random() * 100000000 | 0;
};

export const restart = () => {
  random.current = makeRandom(seed);
};

if (!seed || isNaN(seed)) {
  nextSeed();
}