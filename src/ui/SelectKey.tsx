import { useSignalValue } from "&hooks/useSignalValue";
import { keyPeek } from "&utils/keyboard";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";

export type SelectKeyProps = {
  value: string;
  onChange?: (key: string) => any;
};

export const SelectKey = ({ value, onChange }: SelectKeyProps) => {
  const keySignal = useSignalValue(value);
  const select = useSignal(false);
  const showKey = useComputed(() => select.value ? '...' : keySignal.value);

  useSignalEffect(() => {
    if (!select.value)
      return;

    keyPeek()
      .then((code) => {
        select.value = false;
        if (code === 'Escape')
          return;
        onChange?.(code);
      });
  });

  return (
    <button onKeyDown={e => e.preventDefault()} onClick={() => select.value = !select.value}>{showKey}</button>
  );
};