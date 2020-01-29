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

const MANY_PLANES = 100;

describe("Plane Profile", () => {
    let camera: Camera;

    beforeEach(() => {
        camera = {
            position: { x: 0.0, y: 4.0 },
            angle: 0.0,
            focal_length: 1,
            height: 1,
            x_view_window: 1,
            y_view_window: 1,
            clip_depth: 0.1,
        };
    });

    describe("Many Walls", () => {

        let planes: Plane[];

        beforeEach(() => {
            const texture = convertToFastTexture(randomTexture(64, 64));
            const spritesheet: SpriteSheet = {
                data: [[texture]],
                width: 1,
                height: 1,
            };

            planes = [];

            for (let i = 0; i < 10; i++) {
                planes.push(
                    {
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
                    },
                );
            }

        });

        test("rendering planes", () => {
            profile(MANY_PLANES, () => drawPlanes(mockScreenBuffer, mockDepthBuffer, camera, planes));
        });

    });

});
