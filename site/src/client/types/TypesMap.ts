
import { Vector2D } from "./TypesVector"

export interface Colour {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface Sprite {
    position: Vector2D; 
    size: Vector2D;
    height: number;
    colour: Colour;

    // For computation only
    projectPosition?: Vector2D;
}

export interface GameMap {
    wall_buffer: Wall[];
    sprites: Sprite[];
}

export interface Wall {
    p0: Vector2D;
    p1: Vector2D;
    height0: number;
    height1: number;
    offset0: number;
    offset1: number;
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