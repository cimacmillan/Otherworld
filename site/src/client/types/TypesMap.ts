
import { Vector2D } from "./TypesVector"
import { Texture, TextureCoordinates, FastTexture } from "./TypesRender";

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
}

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
    sprites: Sprite[];
    planes: Plane[];
}

