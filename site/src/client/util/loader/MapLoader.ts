import { Wall, GameMap, Sprite } from "../../types/TypesMap";
import { ScreenBuffer } from "../../render";
import { randomFloatRange, randomIntRange, toRadians } from "../math";
import { Camera, Texture } from "../../types";
import { loadTextureFromURL } from "./TextureLoader";

const VIEWING_ANGLE = toRadians(110.0);

export function initialiseCamera(screen: ScreenBuffer): Camera {
    const aspect_ratio = (screen.width / screen.height);
    const x_view_window = aspect_ratio;
    const y_view_window = 1.0; 
    const focal_length = (x_view_window / 2) / Math.tan(VIEWING_ANGLE / 2);

    return {
        position: { x: 0.0, y: 18.0 }, 
        angle: 0.0, 
        focal_length, 
        height: 0.5, 
        x_view_window, 
        y_view_window, 
        clip_depth: 0.1
    }
}

export function initialiseMap(texture: Texture): GameMap {

    const wall_buffer: Wall[] = [];

    wall_buffer.push({ 
        p0: { x: 0.0, y: 0.0 }, 
        p1: { x: 10.0, y: 0.0 }, 
        height0: 0.5, 
        height1: 1, 
        offset0: 0, 
        offset1: 0
    });

    for(let i = 0; i < 100; i++) {
        wall_buffer.push({ 
            p0: { x: 0.0 + i, y: 10.0 }, 
            p1: { x: 0.0 + i, y: 0.0 }, 
            height0: 1, 
            height1: 1, 
            offset0: 0, 
            offset1: 0
        });
    }

    wall_buffer.push({ 
        p0: { x: 10.0, y: 0.0 }, 
        p1: { x: 10.0, y: 10.0 }, 
        height0: 1, 
        height1: 1, 
        offset0: 0, 
        offset1: 0.5
    });

    // wall_buffer.push({ 
    //     p0: { x: 10.0, y: 10.0 }, 
    //     p1: { x: 0.0, y: 10.0 }, 
    //     height0: 1, 
    //     height1: 1, 
    //     offset0: 0.5, 
    //     offset1: 0
    // });

    wall_buffer.push({ 
        p0: { x: 0.0, y: 10.0 }, 
        p1: { x: 0.0, y: 0.0 }, 
        height0: 1, 
        height1: 0.5, 
        offset0: 0, 
        offset1: 0
    });

    const sprites: Sprite[] = [];
    const spriteCount = 3000;

    for(let i = 0; i < spriteCount; i++) {
        const size = randomFloatRange(0.2, 0.4);
        const height = randomFloatRange(0, 1);
        const colour = {
            a: 255,
            r: randomIntRange(0, 255),
            g: randomIntRange(0, 255),
            b: randomIntRange(0, 255),
        }

        sprites.push({
            position: {x: randomFloatRange(0, 10), y: randomFloatRange(0, 10)}, 
            size: {x: size, y: size},
            height: height,
            texture,
            texcoord: {
                t0: {x: 0, y: 0},
                t1: {x: 1, y: 0},
                t2: {x: 1, y: 1},
                t3: {x: 0, y: 1},
            }
        })
    }

    const planes = [
        {height: 0}
    ]

    const map: GameMap = {wall_buffer, sprites, planes};
    
    return map;
}


