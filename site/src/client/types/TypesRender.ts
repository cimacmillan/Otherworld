import { Vector2D } from "./TypesVector";

export interface Camera {
    position: Vector2D;
    angle: number;
    focal_length: number;
    height: number;
    x_view_window: number;
    y_view_window: number;
    clip_depth: number;
    far_clip_depth: number;
}
