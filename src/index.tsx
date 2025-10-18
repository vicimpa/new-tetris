import { createRoot } from "react-dom/client";
import { App } from "./app";
import { find } from "&utils/dom";

const { min } = Math;
const app = find('#app') as HTMLDivElement;
(onresize = resize, resize());

function resize() {
  app.style.transform = `scale(${min(innerWidth, innerHeight) / 650})`;
}

createRoot(app)
  .render(<App />);
