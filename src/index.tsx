import "preact/debug";

import { render } from "preact";
import { App } from "./app";
import { find } from "&utils/dom";

render(<App />, find('#app'));