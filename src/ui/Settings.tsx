import { Menu } from "./Menu";

const InputSettings = () => (
  <Menu title="Input">
    <h6>Work in progress</h6>
  </Menu>
);

const AudioSettings = () => (

  <Menu title="Audio">
    <h6>Work in progress</h6>
  </Menu>
);

const EffectsSettings = () => (
  <Menu title="Effects">
    <h6>Work in progress</h6>
  </Menu>
);

export const Settings = () => (
  <Menu title="Settings">
    <InputSettings />
    <AudioSettings />
    <EffectsSettings />
  </Menu>
);