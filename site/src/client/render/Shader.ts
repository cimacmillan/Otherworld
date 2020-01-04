import { Colour, Texture, TextureCoordinates } from "../types";
import { vec_sum, vec_scale, vec_interpolate } from "../util/math";

export type Shader = (...args: any) => Colour;

const clipAlpha = (alpha: number) => alpha > 0 ? 255 : 0;

export const textureMap: Shader = (texture: Texture, texcoord: TextureCoordinates, a0: number, a1: number, a2: number, a3: number) => {
    // const finalCoord = vec_sum(vec_scale(texcoord.t0, a0), vec_scale(texcoord.t1, a1), vec_scale(texcoord.t2, a2), vec_scale(texcoord.t3, a3));
    const finalCoord = vec_interpolate([texcoord.t0, texcoord.t1, texcoord.t2, texcoord.t3], [a0, a1, a2, a3]);

    const x = Math.floor(texture.width * finalCoord.x);
    const y = Math.floor(texture.height * finalCoord.y);
    const index = (x + (y * texture.width)) * 4;
    return {
        r: texture.data.data[index],
        g: texture.data.data[index + 1],
        b: texture.data.data[index + 2],
        a: clipAlpha(texture.data.data[index + 3]),
    }
}

export const basicShader: Shader = (colour: Colour) => {
    return colour;
}

