import "preact/debug";

import { render } from "preact";
import { App } from "./app";
import { find } from "&utils/dom";
import { PopupProvider } from "&ui/Popup";

render((
  <PopupProvider>
    <App />
  </PopupProvider>
), find('#app'));