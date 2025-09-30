import { useSignal } from "@preact/signals-react";
import { PopupView } from "./Popup";
import { Show } from "@preact/signals-react/utils";
import { type PropsWithChildren } from "react";

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
          <div className="modal">
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