import { useState, type FC } from "react";
import { Menu } from "./Menu";
import type { Controller } from "&core/Controller";
import styled from "styled-components";
import { useSignals } from "@preact/signals-react/runtime";
import { keyCode } from "&utils/keyboard";

type InputRowProps = {
	title: string;
	value: string[];
	onChange: (v: string[]) => void;
};

const InputTable = styled.table`
	border: 1px solid #999;
	padding: 5px;
	text-align: right;
`;

type InputKeyProps = {
	value: string;
	onChange(v: string): void;
};

const InputKey: FC<InputKeyProps> = ({ value, onChange }) => {
	const [isChange, setIsChange] = useState(false);

	return (
		<input
			readOnly={!isChange}
			style={{ width: '100px', cursor: 'pointer', textAlign: 'center' }}
			onClick={() => {
				setIsChange(true);
			}}
			onKeyDown={e => {
				e.preventDefault();
				e.stopPropagation();
				setIsChange(false);
				if (e.code === 'Escape')
					return;

				if (e.code === 'Backspace')
					return onChange('none');
				onChange(e.code);
			}}
			value={isChange ? 'Change...' : keyCode(value)} />
	);
};

const InputRow = ({ title, value, onChange }: InputRowProps) => {
	const keys = value;
	const onChangeHandler = (v: string, i: number) => {
		const newKeys = [...keys];
		newKeys[i] = v;
		onChange(newKeys);
	};

	return (
		<tr>
			<td style={{ whiteSpace: 'nowrap' }}>{title}</td>
			<td>
				<InputKey
					value={keys[0]}
					onChange={v => {
						onChangeHandler(v, 0);
					}} />
			</td>
			<td>
				<InputKey
					value={keys[1]}
					onChange={v => {
						onChangeHandler(v, 1);
					}} />
			</td>
		</tr>
	);
};

export const InputSettings: FC<{ ctrl: Controller; }> = ({ ctrl }) => {
	useSignals();

	return (
		<Menu title="Input">
			<InputTable>
				<InputRow
					title="Move Left"
					value={ctrl.moveLeftKey}
					onChange={v => ctrl.moveLeftKey = v} />
				<InputRow
					title="Move Right"
					value={ctrl.moveRightKey}
					onChange={v => ctrl.moveRightKey = v} />
				<InputRow
					title="Rotate"
					value={ctrl.rotateKey}
					onChange={v => ctrl.rotateKey = v} />
				<InputRow
					title="Soft down"
					value={ctrl.softDropKey}
					onChange={v => ctrl.softDropKey = v} />
				<InputRow
					title="Hard down"
					value={ctrl.hardDropKey}
					onChange={v => ctrl.hardDropKey = v} />
				<InputRow
					title="To hold"
					value={ctrl.holdKey}
					onChange={v => ctrl.holdKey = v} />
			</InputTable>
		</Menu>
	);
};