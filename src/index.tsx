import { createRoot } from "react-dom/client";
import { App } from "./app";
import { find } from "&utils/dom";

createRoot(find('#app'))
  .render(<App />);
