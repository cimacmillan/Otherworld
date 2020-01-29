import { SAMPLE_LIL, profile, SAMPLE_SMA, SAMPLE_MEDIUM_RARE } from "../ProfileUnit";
import { drawSprite, drawSprites} from "../../../client/render/Sprite";
import { ScreenBuffer } from "../../../client/render/components/ScreenBuffer";
import { DepthBuffer } from "../../../client/render/components/DepthBuffer";
import { Camera, Texture, Sprite } from "../../../client/types";
import { convertToFastTexture } from "../../../client/util/loader/TextureLoader";
import { mockScreenBuffer, mockDepthBuffer } from "../util";

const randomTexture = (width: number, height: number): Texture => {
    let data = new Uint8ClampedArray(width * height * 4);
    return {data: {data, width, height}, width, height};
}

const MANY_SPRITES = 500;

function shuffle(array: any[]) {
    array.sort(() => Math.random() - 0.5);
}

describe("Sprite Profile", () => {
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

    describe("Single Sprite", () => {

        let sprite: Sprite;
            
        beforeEach(() => {
            sprite = {
                position: {x: 0, y: 0}, 
                size: {x: 1, y: 1},
                height: 1,
                texture: convertToFastTexture(randomTexture(64, 64)),
                texcoord: {
                    start: {x: 0, y: 0},
                    end: {x: 1, y: 1},
                },
                projectPosition: {x: 0, y: -4}
            };
            
        });

        test("drawSprite", () => {
            profile(SAMPLE_MEDIUM_RARE, () => drawSprite(mockScreenBuffer, mockDepthBuffer, camera, sprite));
        });

    });

    describe("Many Sprites", () => {

        let sprites: Sprite[];
            
        beforeEach(() => {

            sprites = [];

            for(let i = 0; i < MANY_SPRITES; i++) {
                const depth = (i / MANY_SPRITES) + 4;
                sprites.push({
                    position: {x: 0, y: depth}, 
                    size: {x: 1, y: 1},
                    height: 1,
                    texture: convertToFastTexture(randomTexture(64, 64)),
                    texcoord: {
                        start: {x: 0, y: 0},
                        end: {x: 1, y: 1},
                    },
                    projectPosition: {x: 0, y: -depth}
                    }
                );
            }
        });

        test("best case", () => {
            profile(SAMPLE_SMA, () => drawSprites(mockScreenBuffer, mockDepthBuffer, camera, sprites));
        });

        test("random case", () => {
            shuffle(sprites)
            profile(SAMPLE_SMA, () => drawSprites(mockScreenBuffer, mockDepthBuffer, camera, sprites));
        });

        test("worst case", () => {
            profile(SAMPLE_SMA, () => drawSprites(mockScreenBuffer, mockDepthBuffer, camera, sprites.reverse()));
        });

    });

});

