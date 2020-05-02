export interface MapSchema {
    walls: WallSchema[];
    floors: FloorSchema[];
}

export interface WallSchema {
    startx: number;
    starty: number;
    endx: number;
    endy: number;
    height?: number;
    offset?: number;
    texture?: number;
    collides?: boolean;
}

export interface FloorSchema {
    startx: number;
    starty: number;
    endx: number;
    endy: number;
    height?: number;
    texture?: number;
}
