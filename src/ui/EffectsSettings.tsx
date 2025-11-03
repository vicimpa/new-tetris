import { effects } from "&data/config";
import { useComputed } from "@preact/signals-react";
import { Menu } from "./Menu";
import { Range } from "./Range";

export const EffectsSettings = () => {
	const { shaker, drop, dash } = effects;

	return (
		<Menu title="Effects">
			<Range
				label="Shaker Value"
				min={0}
				max={1.5}
				show={useComputed(() => shaker.value * 100 | 0)}
				defaultValue={shaker.value}
				onChange={v => shaker.value = +v.currentTarget.value}
				step={0.01} />

			<Range
				label="Dash Value"
				min={0}
				max={1.5}
				show={useComputed(() => dash.value * 100 | 0)}
				defaultValue={dash.value}
				onChange={v => dash.value = +v.currentTarget.value}
				step={0.01} />

			<Range
				label="Dash Value"
				min={0}
				max={1.5}
				show={useComputed(() => drop.value * 100 | 0)}
				defaultValue={drop.value}
				onChange={v => drop.value = +v.currentTarget.value}
				step={0.01} />
		</Menu>
	);
};