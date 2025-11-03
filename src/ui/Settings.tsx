import { Menu } from "./Menu";
import { EffectsSettings } from "./EffectsSettings";
import { AudioSettings } from "./AudioSettings";
import { InputSettings } from "./InputSettings";
import type { FC } from "react";
import type { Controller } from "&core/Controller";

export const Settings: FC<{ ctrl: Controller; }> = ({ ctrl }) => (
  <Menu title="Settings">
    <InputSettings ctrl={ctrl} />
    <AudioSettings />
    <EffectsSettings />
  </Menu>
);