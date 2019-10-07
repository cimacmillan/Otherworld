// Jest script requires all files to have .test

import * as Index from '../typescripthelp';

console.log(Index);

test('adds 1 + 2 to equal 3', () => {
    expect(Index.sum(1, 2)).toBe(3);
});