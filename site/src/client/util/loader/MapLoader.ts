import { Wall, GameMap, Camera, Sprite } from "../../types/TypesMap";
import { ScreenBuffer } from "../../render";
import { randomFloatRange, randomIntRange } from "../math";

export function initialiseCamera(screen: ScreenBuffer): Camera {
    let aspect_ratio = (screen.width / screen.height);
    let viewing_angle = 80;
    let radians = (viewing_angle / 180.0) * Math.PI;
    let focal_length = aspect_ratio / Math.tan(radians / 2);
    
    return {
        position: { x: 0.0, y: 18.0 }, 
        angle: 0.0, 
        focal_length, 
        height: 0.5, 
        x_view_window: aspect_ratio, 
        y_view_window: 1.0, 
        clip_depth: 0.1
    }
}

export function initialiseMap(): GameMap {

    const wall_buffer: Wall[] = [];

    wall_buffer.push({ 
        p0: { x: 0.0, y: 0.0 }, 
        p1: { x: 10.0, y: 0.0 }, 
        height0: 0.5, 
        height1: 1, 
        offset0: 0, 
        offset1: 0
    });

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

    const spriteCount = 1000;

    for(let i = 0; i < spriteCount; i++) {
        const size = randomFloatRange(0.02, 0.1);
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
            colour
        })
    }


    const map: GameMap = {wall_buffer, sprites};
    
    return map;
}


