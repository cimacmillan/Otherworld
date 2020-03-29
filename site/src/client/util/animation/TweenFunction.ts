export type TweenFunction = (x: number) => number;

export const identity: TweenFunction = (x: number) => x;

export const floorStepper: (steps: number) => TweenFunction = (
  steps: number
) => {
  return (x: number) => {
    if (x === 1.0) {
      return steps - 1;
    }
    return Math.floor(x * steps);
  };
};
