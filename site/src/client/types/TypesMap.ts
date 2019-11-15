
import { Vector2D } from "./TypesVector"

export interface Wall {
    p0: Vector2D;
    p1: Vector2D;
    height0: number;
    height1: number;
    offset0: number;
    offset1: number;
}

export interface GameMap {
    wall_buffer: Wall[];
}

export interface Camera {
    position: Vector2D;
    angle: number;
    focal_length: number;
    height: number;
    x_view_window: number;
    y_view_window: number;
    clip_depth: number
}