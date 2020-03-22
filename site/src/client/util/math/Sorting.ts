export function swap<T>(array: T[], indexA: number, indexB: number) {
  const temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
}

// Swap sort performs passes over array and
export function swapSort<T>(
  array: T[],
  comparisonFunction: (a: T, b: T) => boolean
) {
  let discrepency = true;
  while (discrepency) {
    discrepency = false;
    for (let i = 0; i < array.length - 1; i++) {
      const compare = comparisonFunction(array[i], array[i + 1]);
      const notCompare = comparisonFunction(array[i + 1], array[i]);
      if (!compare && notCompare) {
        discrepency = true;
        swap(array, i, i + 1);
      }
    }
  }
}
