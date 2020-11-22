import { MapNode } from "./MapNode";

export enum QuadDirection {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3,
}

export interface QuadMapGrid {
    nodes: QuadMapNode[];
    width: number;
    height: number;
}

export interface QuadMapNode {
    node: MapNode;
    x: number;
    y: number;
}

const DIRECTIONS = [
    QuadDirection.UP,
    QuadDirection.RIGHT,
    QuadDirection.DOWN,
    QuadDirection.LEFT,
];

const OPPOSING_DIRECTIONS = [
    QuadDirection.DOWN,
    QuadDirection.LEFT,
    QuadDirection.UP,
    QuadDirection.RIGHT,
];

const getOpposingDirection = (direction: QuadDirection) =>
    OPPOSING_DIRECTIONS[direction];
const getXYOffset = (direction: QuadDirection): { x: number; y: number } => {
    switch (direction) {
        case QuadDirection.UP:
            return { x: 0, y: -1 };
        case QuadDirection.DOWN:
            return { x: 0, y: 1 };
        case QuadDirection.LEFT:
            return { x: -1, y: 0 };
        case QuadDirection.RIGHT:
            return { x: 1, y: 0 };
    }
};

export class QuadMap {
    private mapNodes: QuadMapNode[] = [];
    private minX = 0;
    private minY = 0;
    private maxX = 0;
    private maxY = 0;

    public constructor(private nodeGenerator: () => MapNode) {
        this.mapNodes = [{ node: nodeGenerator(), x: 0, y: 0 }];
    }

    public getAvailableDirections(mapNode: MapNode): number[] {
        const availableDirections = DIRECTIONS.filter(
            (direction: number) => !mapNode.isNodePresent(direction)
        );
        return availableDirections;
    }

    public createNodeAtDirection(
        mapNode: QuadMapNode,
        direction: QuadDirection
    ): QuadMapNode {
        if (mapNode.node.isNodePresent(direction)) {
            throw new Error("Attempting to create duplicate node");
        }

        const node = this.nodeGenerator();
        const offset = getXYOffset(direction);
        const x = mapNode.x + offset.x;
        const y = mapNode.y + offset.y;
        const quadNode = { node, x, y };

        if (x < this.minX) {
            this.minX = x;
        }
        if (x > this.maxX) {
            this.maxX = x;
        }
        if (y < this.minY) {
            this.minY = y;
        }
        if (y > this.maxY) {
            this.maxY = y;
        }

        this.crossAttachNodeAtDirection(quadNode, QuadDirection.UP);
        this.crossAttachNodeAtDirection(quadNode, QuadDirection.DOWN);
        this.crossAttachNodeAtDirection(quadNode, QuadDirection.LEFT);
        this.crossAttachNodeAtDirection(quadNode, QuadDirection.RIGHT);
        this.mapNodes.push(quadNode);
        return quadNode;
    }

    public getRootNode() {
        return this.mapNodes[0];
    }

    public getMapNodes(): QuadMapNode[] {
        return this.mapNodes;
    }

    public getGrid(): QuadMapGrid {
        const width = this.maxX - this.minX + 1;
        const height = this.maxY - this.minY + 1;
        const nodes: QuadMapNode[] = new Array(width * height).fill(undefined);

        this.mapNodes.forEach((node) => {
            const adjustedX = node.x - this.minX;
            const adjustedY = node.y - this.minY;
            const index = adjustedX + width * adjustedY;
            nodes[index] = node;
        });

        return { nodes, width, height };
    }

    public getNodeAtCoordinate(x: number, y: number): QuadMapNode | undefined {
        const node = this.mapNodes.find((node) => node.x === x && node.y === y);
        return node;
    }

    private crossAttachNodeAtDirection(
        source: QuadMapNode,
        direction: QuadDirection
    ) {
        const coordinate = getXYOffset(direction);
        const x = source.x + coordinate.x;
        const y = source.y + coordinate.y;
        const toAttach = this.getNodeAtCoordinate(x, y);

        if (toAttach) {
            this.crossAttachNodes(source, toAttach, direction);
        }
    }

    private crossAttachNodes(
        rootQuad: QuadMapNode,
        toAttachQuad: QuadMapNode,
        direction: QuadDirection
    ) {
        const root = rootQuad.node;
        const toAttach = toAttachQuad.node;

        const opposingDirection = getOpposingDirection(direction);

        if (
            root.isNodePresent(direction) ||
            toAttach.isNodePresent(opposingDirection)
        ) {
            throw new Error(
                "QuadMap crossAttachNodes is attempting to attach existing link"
            );
        }

        root.setNodeAtDirection(direction, toAttach);
        toAttach.setNodeAtDirection(opposingDirection, root);
    }
}
