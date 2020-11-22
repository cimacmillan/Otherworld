interface DirectionMap {
    [direction: number]: MapNode | undefined;
}

export class MapNode {
    private directionMap: DirectionMap = {};

    public setNodeAtDirection(direction: number, node: MapNode): void {
        this.directionMap[direction] = node;
    }

    public getNodeAtDirection(direction: number): MapNode {
        return this.directionMap[direction];
    }

    public isNodePresent(direction: number): boolean {
        return !!this.directionMap[direction];
    }
}
