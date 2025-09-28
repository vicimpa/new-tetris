import { Figure } from "&core/Figure";
import { Render } from "&core/Render";
import { colors } from "&data/colors";
import { useSignalValue } from "&hooks/useSignalValue";
import { useComputed } from "@preact/signals";
import { Canvas } from "./Canvas";
import { MaybeSignal, unsignal } from "&utils/signals";

export type FigureViewProps = {
  figure?: MaybeSignal<Figure | null | undefined>;
  color?: MaybeSignal<string | undefined>;
  opacity?: MaybeSignal<number>;
  clip?: true;
  size?: number;
};

export const FigureView = ({ clip, size = 20, figure, opacity = 1, color }: FigureViewProps) => {
  const figureSignal = useSignalValue(figure);
  const nowSignal = useComputed(() => unsignal(figureSignal));

  const canvas = <Canvas
    draw={ctx => {
      ctx.resetTransform();
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      const { value: now } = nowSignal;
      if (!now) {
        ctx.width = 0;
        ctx.height = 0;
        return;
      }
      const rect = now.rect();
      ctx.width = rect.width * size;
      ctx.height = rect.height * size;
      ctx.transform(1, 0, 0, -1, 0, ctx.height);

      now.each((v, x, y) => {
        if (!v) return;
        ctx.drawBlock(x - rect.x, y - rect.y, size, unsignal(color) ?? colors[v - 1] ?? '#000', unsignal(opacity));
      });
    }}
  />;

  if (clip)
    return canvas;

  return (
    <div class="viewer" style={{ width: size * 4, height: size * 4 }}>
      {canvas}
    </div>
  );
};