import type { FC, JSX, ReactNode } from "react";

export type RangeProps = {
  label?: string;
  show?: ReactNode;
} & Omit<JSX.IntrinsicElements['input'], 'type'>;

export const Range: FC<RangeProps> = ({ label, show, ...props }) => {

  return (
    <label className="range">
      <div className="head">
        <span>{label}</span>
        {show && <span>{show}</span>}
      </div>
      <input type="range" {...props} />
    </label>
  );
};