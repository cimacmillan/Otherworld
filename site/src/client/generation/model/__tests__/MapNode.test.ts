import { MapNode } from "../MapNode";

describe("MapNode", () => {
    it.each([0, 1, 2, 3, 4, 5, 6])(
        "should set nodes as present",
        (dir: number) => {
            const node = new MapNode();
            const attach = new MapNode();

            node.setNodeAtDirection(dir, attach);

            expect(node.getNodeAtDirection(dir)).toBe(attach);
            expect(node.isNodePresent(dir)).toBe(true);
            expect(node.isNodePresent(dir + 1)).toBe(false);
            expect(node.isNodePresent(dir - 1)).toBe(false);
        }
    );
});
