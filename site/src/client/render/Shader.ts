import { Colour, Texture, TextureCoordinates } from "../types";
import { vec_sum, vec_scale, vec_interpolate } from "../util/math";

export type Shader = (...args: any) => Colour;

const clipAlpha = (alpha: number) => alpha > 0 ? 255 : 0;

const textureMapReturn = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
}

export const textureMap: Shader = (texture: Texture, u: number, v: number) => {
    const x = Math.floor(texture.width * u) % texture.width;
    const y = Math.floor(texture.height * v) % texture.height;
    const index = (x + (y * texture.width)) * 4;

    textureMapReturn.r = texture.data.data[index];
    textureMapReturn.g = texture.data.data[index + 1];
    textureMapReturn.b = texture.data.data[index + 2];
    textureMapReturn.a = clipAlpha(texture.data.data[index + 3]);

    return textureMapReturn;
}

export const basicShader: Shader = (colour: Colour) => {
    return colour;
}

