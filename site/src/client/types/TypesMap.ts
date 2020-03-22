import { FastTexture, SpriteSheet, TextureCoordinates } from "./TypesRender";
import { Vector2D } from "./TypesVector";

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

  texture: FastTexture;
  texcoord: TextureCoordinates;

  // For computation only
  projectPosition?: Vector2D;
}

export interface Plane {
  height: number;
  start: Vector2D;
  end: Vector2D;
  spritesheet: SpriteSheet;
}

export interface Wall {
  p0: Vector2D;
  p1: Vector2D;

  height0: number;
  height1: number;
  offset0: number;
  offset1: number;

  texture: FastTexture;
  texcoord: TextureCoordinates;
}

export interface GameMap {
  wall_buffer: Wall[];
  sprites: Sprite[];
  floor?: Plane;
  ceiling?: Plane;
  backgroundColour: Colour;
}
