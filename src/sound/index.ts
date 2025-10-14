import { signalPackedStore } from '&utils/signals';
import { t } from '@vicimpa/data-pack';

const ctx = new AudioContext();
export const gain = ctx.createGain();
const postGain = ctx.createGain();
gain.connect(postGain);
postGain.connect(ctx.destination);
postGain.gain.value = .5;

export const volume = signalPackedStore('volume', t.float(32), .5);

volume.subscribe(v => {
  gain.gain.value = v;
});

function makeSound(src: string) {
  let buff: AudioBuffer | null = null;

  Promise.resolve(src)
    .then(fetch)
    .then(r => r.arrayBuffer())
    .then(b => ctx.decodeAudioData(b))
    .then(b => buff = b);

  return {
    play({ loop = false, rate = 1 } = {}) {
      if (!buff)
        return;

      const node = ctx.createBufferSource();
      node.onended = () => {
        node.disconnect(gain);
      };
      node.connect(gain);
      node.buffer = buff;
      node.playbackRate.value = rate;
      node.loop = loop ?? false;
      node.start();

      return () => {
        node.stop();
      };
    }
  };
}

const source = import.meta.glob('./*.mp3', {
  eager: true
}) as Record<string, typeof import('*.mp3')>;

const basename = (path: string) => (
  path.replace(/.*\/([\w]+)\.[\w]+$/, '$1')
);

const sounds = Object.entries(source)
  .reduce((acc, [key, { default: value }]) => (
    Object.assign(acc, {
      [basename(key)]: makeSound(value)
    })
  ), {} as Record<string, ReturnType<typeof makeSound>>);

export function sound(name: string, options?: Parameters<(typeof sounds)[string]['play']>[0]) {
  sounds[name]?.play(options);
}