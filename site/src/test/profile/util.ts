import { ScreenBuffer, DepthBuffer } from "../../client/render";

const emptyFunction = () => {};
const emptyUIntClampedArray: Uint8ClampedArray = new Uint8ClampedArray();

export const mockScreenBuffer = {
    width: 256,
    height: 256,
    image_data: { data: emptyUIntClampedArray, width: 256, height: 256},
    putPixel: emptyFunction,
    putPixelColour: emptyFunction,
    fillBackground: emptyFunction,
    reset: emptyFunction
} as ScreenBuffer;

export const mockDepthBuffer = {
    isCloser: () => true,
    setDistance: emptyFunction,
    forceSet: emptyFunction,
    reset: emptyFunction,
    data: [1],
    width: 256,
    height: 256
} as DepthBuffer;

