import "preact/debug";

import { render } from "preact";
import { App } from "./app";
import { find } from "&utils/dom";
import { sound } from "&sound";

render(<App />, find('#app'));

sound('');