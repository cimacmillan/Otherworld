import { Wall } from "./TypesMap"
import { Vector2D } from "./TypesVector"

export interface Ray {
    wall: Wall,
    wall_interpolation: number,
    ray_interpolation: number,
    origin: Vector2D,
    direction: Vector2D,
    intersection: Vector2D,
    length: number
}

export interface Camera {
    position: Vector2D;
    angle: number;
    focal_length: number;
    height: number;
    x_view_window: number;
    y_view_window: number;
    clip_depth: number;
}

export enum TextureSampleType {
    LINEAR = "LINEAR"
}

export interface TextureCoordinates {
    t0: Vector2D;
    t1: Vector2D;
    t2: Vector2D;
    t3: Vector2D;
}

export interface Texture {
    data: ImageData;
    width: number;
    height: number;
}

