import { QuadMap, QuadDirection } from "../client/generation/model/QuadMap";
import { MapNode } from "../client/generation/model/MapNode";

console.log("Generator");

const quadMap = new QuadMap(() => new MapNode());
// const newNode = quadMap.createNodeAtDirection(quadMap.getRootNode(), QuadDirection.DOWN);
// quadMap.createNodeAtDirection(newNode, QuadDirection.RIGHT);

const getRandomNodes = () =>
    quadMap
        .getMapNodes()
        .filter((node) => quadMap.getAvailableDirections(node.node).length > 0);

const step = () => {
    const nodes = getRandomNodes();
    console.log(nodes.length);

    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const directions = quadMap.getAvailableDirections(node.node);
    const direction = directions[Math.floor(Math.random() * directions.length)];
    quadMap.createNodeAtDirection(node, direction);
};

for (let i = 0; i < 100; i++) {
    step();
}

console.log("Map nodes: ", quadMap.getMapNodes().length);

const grid = quadMap.getGrid();

console.log("Grid generated", grid.width, grid.height);
let gridNodeCount = 0;
for (let y = 0; y < grid.height; y++) {
    let line = "";
    for (let x = 0; x < grid.width; x++) {
        const index = x + y * grid.width;
        if (grid.nodes[index]) {
            line = line + "|X";
            gridNodeCount++;
        } else {
            line = line + "| ";
        }
    }
    line = line + "|";
    console.log(line);
}
console.log("Grid node count", gridNodeCount);
console.log(
    "Grid nodes raw",
    JSON.stringify(grid.nodes.map((node) => (node ? 1 : 0)))
);
console.log(
    "Map nodes raw",
    JSON.stringify(
        quadMap.getMapNodes().map((node) => ({ x: node.x, y: node.y }))
    )
);
