import { Colour, Wall } from "./TypesMap";
import { Vector2D } from "./TypesVector";

export interface Ray {
  wall: Wall;
  wall_interpolation: number;
  ray_interpolation: number;
  origin: Vector2D;
  direction: Vector2D;
  intersection: Vector2D;
  length: number;
}

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

export enum TextureSampleType {
  LINEAR = "LINEAR",
}

export interface TextureCoordinates {
  start: Vector2D;
  end: Vector2D;
}

export interface Texture {
  data: ImageData;
  width: number;
  height: number;
}

export interface FastTexture {
  data: Colour[][];
  width: number;
  height: number;
}

export interface SpriteSheet {
  data: FastTexture[][];
  width: number;
  height: number;
}
