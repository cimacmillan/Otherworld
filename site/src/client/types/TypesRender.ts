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
