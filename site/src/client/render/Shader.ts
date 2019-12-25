import { Colour } from "../types";

export type Shader = (...args: any) => Colour;

export const basicShader: Shader = (colour: Colour) => {
    return colour;
}

