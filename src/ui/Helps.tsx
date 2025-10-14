import type { Controller } from "&core/Controller";
import { useSignals } from "@preact/signals-react/runtime";
import type { FC } from "react";

export type HelpsProps = {
  ctrl: Controller;
};

// TODO: Перенеси представление на Controller

function keys(code: string | string[]): string {
  if (Array.isArray(code))
    return code.map(keys).join(' / ');

  return code.replace(/^(Arrow|Key)/, '');
}

export const Helps: FC<HelpsProps> = ({ ctrl }) => {
  useSignals();
  return (
    <div className="helps">
      <p>Move left<br /><b>{keys(ctrl.moveLeftKey)}</b></p>
      <p>Move right<br /><b>{keys(ctrl.moveRightKey)}</b></p>
      <p>Rotate<br /><b>{keys(ctrl.rotateKey)}</b></p>
      <p>Soft down<br /><b>{keys(ctrl.softDropKey)}</b></p>
      <p>Hard down<br /><b>{keys(ctrl.hardDropKey)}</b></p>
      <p>To hold<br /><b>{keys(ctrl.holdKey)}</b></p>
    </div>
  );
};