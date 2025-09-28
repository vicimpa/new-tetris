import { Render } from "&core/Render";
import { dispose } from "&utils/function";
import { looper } from "&utils/looper";
import { effect, useComputed } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";
import { JSX, useEffect } from "preact/compat";

export type CanvasProps = {
  draw?: (ctx: Render) => void | (() => void);
  loop?: (ctx: Render, delta: number, time: number) => void;
} & Omit<JSX.IntrinsicElements['canvas'], 'ref' | 'children'>;

export const Canvas = ({ draw, loop, ...props }: CanvasProps) => {
  const canRef = useSignalRef<HTMLCanvasElement | null>(null);
  const ctxRef = useComputed(() => Render.fromCanvas(canRef.value) ?? null);

  useEffect(() => (
    effect(() => {
      const { value: ctx } = ctxRef;
      if (!ctx)
        return;

      return dispose(
        draw?.(ctx),
        loop ? looper((delta, time) => {
          loop(ctx, delta, time);
        }) : undefined
      );
    })
  ));

  return (
    <canvas ref={canRef} {...props} />
  );
};