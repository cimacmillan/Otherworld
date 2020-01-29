import { SAMPLE_LIL, profile, SAMPLE_SMA, SAMPLE_MEDIUM_RARE } from "../ProfileUnit";
import { drawSprite, drawSprites} from "../../../client/render/Sprite";
import { ScreenBuffer } from "../../../client/render/components/ScreenBuffer";
import { DepthBuffer } from "../../../client/render/components/DepthBuffer";
import { Camera, Texture, Sprite, Wall } from "../../../client/types";
import { convertToFastTexture } from "../../../client/util/loader/TextureLoader";
import { drawWalls } from "../../../client/render/Walls";
import { mockScreenBuffer, mockDepthBuffer } from "../util";

const randomTexture = (width: number, height: number): Texture => {
    let data = new Uint8ClampedArray(width * height * 4);
    return {data: {data, width, height}, width, height};
}

const MANY_WALLS = 1000;

describe("Wall Profile", () => {
    let camera: Camera;

    beforeEach(() => {
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
            profile(MANY_WALLS, () => drawWalls(mockScreenBuffer, mockDepthBuffer, camera, walls));
        });

    });

});

