const ctx = new AudioContext();
export const gain = ctx.createGain();

gain.connect(ctx.destination);

const source = Object.entries(import.meta.glob('./*.mp3', { eager: true }))
  .reduce((acc, [key, { default: value }]: [string, { default: string; }]) => {
    let buff: AudioBuffer | null = null;

    Promise.resolve(value)
      .then(fetch)
      .then(r => r.arrayBuffer())
      .then(b => ctx.decodeAudioData(b))
      .then(b => buff = b);

    return {
      ...acc, [key.replace(/.*\/([^\.]+)\.\w+$/, '$1')]: {
        play(loop?: true) {
          if (!buff)
            return;

          const node = ctx.createBufferSource();
          node.onended = () => {
            node.disconnect(gain);
          };
          node.connect(gain);
          node.buffer = buff;
          node.loop = loop ?? false;
          node.start();

          return () => {
            node.stop();
          };
        }
      }
    };
  }, {} as Record<string, { play(): void | (() => void); }>);

export function sound(name: string) {
  source[name]?.play();
}