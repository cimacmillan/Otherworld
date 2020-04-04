import { Vector2D } from "./TypesVector";

export interface Camera {
    position: Vector2D;
    height: number;
    angle: number;
    fov: number;
    aspectRatio: number;
    zNear: number;
    zFar: number;
}
