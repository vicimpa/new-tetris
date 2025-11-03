import type { Controller } from "&core/Controller";
import { keyCode } from "&utils/keyboard";
import { useSignals } from "@preact/signals-react/runtime";
import type { FC } from "react";

export type HelpsProps = {
  ctrl: Controller;
};

// TODO: Перенеси представление на Controller


export const Helps: FC<HelpsProps> = ({ ctrl }) => {
  useSignals();
  return (
    <div className="helps">
      <p>Move left<br /><b>{keyCode(ctrl.moveLeftKey)}</b></p>
      <p>Move right<br /><b>{keyCode(ctrl.moveRightKey)}</b></p>
      <p>Rotate<br /><b>{keyCode(ctrl.rotateKey)}</b></p>
      <p>Soft down<br /><b>{keyCode(ctrl.softDropKey)}</b></p>
      <p>Hard down<br /><b>{keyCode(ctrl.hardDropKey)}</b></p>
      <p>To hold<br /><b>{keyCode(ctrl.holdKey)}</b></p>
    </div>
  );
};