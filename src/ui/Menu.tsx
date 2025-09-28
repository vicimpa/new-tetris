import { useSignal } from "@preact/signals";
import { PopupView } from "./Popup";
import { Show } from "@preact/signals/utils";
import { PropsWithChildren } from "preact/compat";

export type MenuProps = {
  title: string;
} & PropsWithChildren;

export const Menu = ({ title, children }: MenuProps) => {
  const show = useSignal(false);
  return (
    <>
      <button onClick={() => show.value = true}>{title}</button>
      <Show when={show}>
        <PopupView>
          <div class="modal">
            <h4>{title}</h4>
            <hr />
            {children}
            <br />
            <button onClick={() => show.value = false}>Close</button>
          </div>
        </PopupView>
      </Show>
    </>
  );
};