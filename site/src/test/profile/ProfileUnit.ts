export type ProfileFunction = () => any;

// Not based on any actual statistics
export const SAMPLE_BIG = Math.pow(10, 9);
export const SAMPLE_MED = Math.pow(10, 6);
export const SAMPLE_MEDIUM_RARE = Math.pow(10, 5);
export const SAMPLE_SMA = Math.pow(10, 4);
export const SAMPLE_LIL = Math.pow(10, 3);

export function profile(sampleSize: number, toProfile: ProfileFunction) {
  const before = new Date().getTime();
  for (let i = 0; i < sampleSize; i++) {
    toProfile();
  }
  const after = new Date().getTime();
  const time = after - before;

  expect(time).toMatchSnapshot();
}

export function profileWithCheck(
  sampleSize: number,
  toProfile: ProfileFunction,
  expected: any
) {
  let sum = 0;
  for (let i = 0; i < sampleSize; i++) {
    const before = new Date().getTime();
    const result = toProfile();
    const after = new Date().getTime();
    sum += after - before;
    expect(result).toEqual(expected);
  }
  expect(sum).toMatchSnapshot();
}
