import { drawPlanes } from "../../../client/render";
import { DepthBuffer } from "../../../client/render/components/DepthBuffer";
import { ScreenBuffer } from "../../../client/render/components/ScreenBuffer";
import { drawSprite, drawSprites} from "../../../client/render/Sprite";
import { Camera, Plane, SpriteSheet, Texture } from "../../../client/types";
import { convertToFastTexture } from "../../../client/util/loader/TextureLoader";
import { profile, SAMPLE_LIL, SAMPLE_MEDIUM_RARE, SAMPLE_SMA } from "../ProfileUnit";
import { mockDepthBuffer, mockScreenBuffer } from "../util";

const randomTexture = (width: number, height: number): Texture => {
    const data = new Uint8ClampedArray(width * height * 4);
    return {data: {data, width, height}, width, height};
};

const MANY_PLANES = 5000;

describe("Plane Profile", () => {
    let camera: Camera;

    beforeEach(() => {
        camera = {
            position: { x: 5.0, y: 5.0 },
            angle: -Math.PI/2 + 0.1,
            focal_length: 1,
            height: 1,
            x_view_window: 1,
            y_view_window: 1,
            clip_depth: 0.1,
            far_clip_depth: 20
        };
    });

    describe("Many planes", () => {

        let floor: Plane;
        let ceiling: Plane;
        const colour = {r: 255, g: 255, b: 255, a: 255};

        beforeEach(() => {
            const texture = convertToFastTexture(randomTexture(64, 64));
            const spritesheet: SpriteSheet = {
                data: [[texture]],
                width: 1,
                height: 1,
            };

            floor = {
                height: 0,
                start: {
                    x: 0,
                    y: 0,
                },
                end: {
                    x: 10,
                    y: 10,
                },
                spritesheet,
            };

            ceiling = {
                height: 2,
                start: {
                    x: 0,
                    y: 0,
                },
                end: {
                    x: 10,
                    y: 10,
                },
                spritesheet,
            };

        });

        test("rendering planes", () => {
            profile(MANY_PLANES, () => drawPlanes(mockScreenBuffer, mockDepthBuffer, camera, colour, floor, ceiling));
        });

    });

});
