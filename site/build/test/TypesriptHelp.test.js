"use strict";
// Jest script requires all files to have .test
Object.defineProperty(exports, "__esModule", { value: true });
const Index = require("../client/TypescriptHelp");
console.log(Index);
test('adds 1 + 2 to equal 3', () => {
    expect(Index.sum(1, 2)).toBe(3);
});
//# sourceMappingURL=TypesriptHelp.test.js.map