
import { volume } from "&sound";
import { useSignals } from "@preact/signals-react/runtime";
import { Range } from "./Range";

const VolumeShow = () => {
  useSignals();

  if (!volume.value)
    return 'Off';

  return (volume.value * 100 | 0) + '%';
};

export const Volume = () => {
  return (
    <Range
      label="Volume"
      min={0}
      max={1}
      show={<VolumeShow />}
      defaultValue={volume.value}
      onChange={v => volume.value = +v.currentTarget.value}
      step={0.01} />
  );
};
