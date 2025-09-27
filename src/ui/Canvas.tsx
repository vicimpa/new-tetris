import { Render } from "&core/Render";
import { dispose } from "&utils/dispose";
import { looper } from "&utils/looper";
import { effect, useComputed } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";
import { JSX, useEffect } from "preact/compat";

export type CanvasProps = {
  scale?: number;
  width?: number;
  height?: number;
  draw?: (ctx: Render) => void | (() => void);
  loop?: (ctx: Render, delta: number, time: number) => void;
} & Omit<JSX.IntrinsicElements['canvas'], 'ref' | 'children' | 'width' | 'height'>;

export const Canvas = ({ draw, loop, scale = 1, width = 360, height = 200, ...props }: CanvasProps) => {
  const canRef = useSignalRef<HTMLCanvasElement | null>(null);
  const ctxRef = useComputed(() => Render.fromCanvas(canRef.value, scale) ?? null);

  useEffect(() => (
    effect(() => {
      const { value: ctx } = ctxRef;
      if (!ctx) return;

      ctx.resetTransform();
      ctx.lineWidth = 1 / scale;
      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = false;

      return dispose(
        draw?.(ctx),
        loop ? looper((delta, time) => {
          loop(ctx, delta, time);
        }) : undefined
      );
    })
  ));

  return (
    <canvas
      ref={canRef}
      width={width * scale}
      height={height * scale}
      {...props} />
  );
};