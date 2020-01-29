import { SAMPLE_LIL, profile, SAMPLE_SMA, SAMPLE_MEDIUM_RARE } from "../ProfileUnit";
import { drawSprite, drawSprites} from "../../../client/render/Sprite";
import { ScreenBuffer } from "../../../client/render/components/ScreenBuffer";
import { DepthBuffer } from "../../../client/render/components/DepthBuffer";
import { Camera, Texture, Sprite, Wall } from "../../../client/types";
import { convertToFastTexture } from "../../../client/util/loader/TextureLoader";
import { drawWalls } from "../../../client/render/Walls";

jest.mock("../../../client/render/components/ScreenBuffer");
jest.mock("../../../client/render/components/DepthBuffer");

const mockedScreenbuffer = ScreenBuffer as jest.Mock<ScreenBuffer>;
const mockedDepthBuffer = DepthBuffer as jest.Mock<DepthBuffer>;

const randomTexture = (width: number, height: number): Texture => {
    let data = new Uint8ClampedArray(width * height * 4);
    return {data: {data, width, height}, width, height};
}

const MANY_WALLS = 100;

describe("Wall Profile", () => {
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
            height: 0.5, 
            x_view_window: 1, 
            y_view_window: 1, 
            clip_depth: 0.1
        };
    });

    describe("Many Walls", () => {

        let walls: Wall[];
            
        beforeEach(() => {
            walls = [];
            const texture = convertToFastTexture(randomTexture(64, 64));

            for (let i = 0; i < 10; i++) {
                walls.push({ 
                    p0: { x: -5.0, y: 0.0 }, 
                    p1: { x: 5.0, y: 0.0 }, 
                    height0: 1, 
                    height1: 1, 
                    offset0: 0, 
                    offset1: 0,
                    texture,
                    texcoord: {
                        start: {
                            x: 0,
                            y: 0
                        },
                        end: {
                            x: 10,
                            y: 1
                        }
                    }
                });
            }
        });

        test("rendering walls", () => {
            profile(MANY_WALLS, () => drawWalls(screenBuffer, depthBuffer, camera, walls));
        });

    });

});

