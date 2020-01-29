import { SAMPLE_LIL, profile, SAMPLE_SMA, SAMPLE_MEDIUM_RARE } from "../ProfileUnit";
import { drawSprite, drawSprites} from "../../../client/render/Sprite";
import { ScreenBuffer } from "../../../client/render/components/ScreenBuffer";
import { DepthBuffer } from "../../../client/render/components/DepthBuffer";
import { Camera, Texture, Sprite, Wall, Plane, SpriteSheet } from "../../../client/types";
import { convertToFastTexture } from "../../../client/util/loader/TextureLoader";
import { drawWalls } from "../../../client/render/Walls";
import { drawPlanes } from "../../../client/render";

jest.mock("../../../client/render/components/ScreenBuffer");
jest.mock("../../../client/render/components/DepthBuffer");

const mockedScreenbuffer = ScreenBuffer as jest.Mock<ScreenBuffer>;
const mockedDepthBuffer = DepthBuffer as jest.Mock<DepthBuffer>;

const randomTexture = (width: number, height: number): Texture => {
    let data = new Uint8ClampedArray(width * height * 4);
    return {data: {data, width, height}, width, height};
}

const MANY_PLANES = 10;

describe("Plane Profile", () => {
    let screenBuffer: ScreenBuffer;
    let depthBuffer: DepthBuffer;
    let camera: Camera;

    beforeEach(() => {
        mockedScreenbuffer.mockReset();
        screenBuffer = new mockedScreenbuffer();
        depthBuffer = new mockedDepthBuffer();
        screenBuffer.width = 256;
        screenBuffer.height = 256;
        camera = {
            position: { x: 0.0, y: 4.0 }, 
            angle: 0.0, 
            focal_length: 1, 
            height: 1, 
            x_view_window: 1, 
            y_view_window: 1, 
            clip_depth: 0.1
        };
    });

    describe("Many Walls", () => {

        let planes: Plane[];
            
        beforeEach(() => {
            const texture = convertToFastTexture(randomTexture(64, 64));
            const spritesheet: SpriteSheet = {
                data: [[texture]], 
                width: 1,
                height: 1
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
                        spritesheet
                    }
                );
            }

        });

        test("rendering planes", () => {
            profile(MANY_PLANES, () => drawPlanes(screenBuffer, depthBuffer, camera, planes));
        });

    });

});

