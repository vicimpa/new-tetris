function range(to: number): Generator<number>;
function range(from: number, to: number): Generator<number>;
function range(from: number, to: number, step: number): Generator<number>;
function range(from: number, to: number, step: number, include: boolean): Generator<number>;
function* range(a: number, b?: number, c = 1, d = false): Generator<number> {
  if (b === undefined)
    return yield* range(0, a, c, d);

  var steps = (b - a) / c + +d;

  if (steps < 0)
    throw new Error(`Infinite range`);

  for (let i = 0; i < steps; i++)
    yield a + c * i;
}

export { range };