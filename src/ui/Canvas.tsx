import { Render } from "&core/Render";
import { dispose } from "&utils/function";
import { looper } from "&utils/looper";
import { effect, useComputed } from "@preact/signals-react";
import { useSignalRef } from "@preact/signals-react/utils";
import { type JSX, useEffect } from "react";
import styled from "styled-components";

const StyledCanvas = styled.canvas`
  pointer-events: none;
`;

export type CanvasProps = {
  draw?: (ctx: Render) => void | (() => void);
  loop?: (ctx: Render, delta: number, time: number) => void;
} & Omit<JSX.IntrinsicElements['canvas'], 'ref' | 'children'>;

export const Canvas = ({ draw, loop, ...props }: CanvasProps) => {
  const canRef = useSignalRef<HTMLCanvasElement | null>(null);
  const ctxRef = useComputed(() => canRef.value && Render.fromCanvas(canRef.value));

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
    <StyledCanvas ref={canRef} {...props} />
  );
};