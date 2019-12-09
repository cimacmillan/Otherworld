// Jest script requires all files to have .test

import * as Index from '../client/TypescriptHelp';

test('adds 1 + 2 to equal 3', () => {
    expect(Index.sum(1, 2)).toBe(3);
});

test('adds 3 + 1 to equal 4', () => {
    expect(Index.sum(3, 1)).toBe(4);
});
