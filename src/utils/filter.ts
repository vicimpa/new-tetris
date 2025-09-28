import { array } from "./array";

export function filter(size: number) {
  const data = array(size, 0);

  return (value: number) => {
    data.shift();
    data.push(value);
    return data.reduce((a, b) => a + b) / size;
  };
}