import { Colour, FastTexture, Texture, TextureCoordinates } from "../types";
import { vec_interpolate, vec_scale, vec_sum } from "../util/math";

export type Shader = (...args: any) => Colour;

export const shade: Shader = (texture: FastTexture, u: number, v: number, depth: number, farClip: number) => {
    const x = ~~(texture.width * u) % texture.width;
    const y = ~~(texture.height * v) % texture.height;

    return texture.data[x][y];
};

export const basicShader: Shader = (colour: Colour) => {
    return colour;
};
