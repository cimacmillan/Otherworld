import { Vector2D } from "./types/TypesVector";
import { Wall, GameMap, Camera } from "./types/TypesMap";

export var wall_buffer: Wall[];
export var map: GameMap;
export var camera: Camera;

export function initialiseMap(screen: Screen) {

    wall_buffer = [];

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

    wall_buffer.push({ 
        p0: { x: 10.0, y: 10.0 }, 
        p1: { x: 0.0, y: 10.0 }, 
        height0: 1, 
        height1: 1, 
        offset0: 0.5, 
        offset1: 0
    });

    wall_buffer.push({ 
        p0: { x: 0.0, y: 10.0 }, 
        p1: { x: 0.0, y: 0.0 }, 
        height0: 1, 
        height1: 0.5, 
        offset0: 0, 
        offset1: 0
    });

    map = {wall_buffer};

    let aspect_ratio = (screen.width / screen.height);
    let viewing_angle = 80;
    let radians = (viewing_angle / 180.0) * Math.PI;
    let focal_length = aspect_ratio / Math.tan(radians / 2);
    
    camera = {
        position: { x: 5.0, y: 8.0 }, 
        angle: 0.0, 
        focal_length, 
        height: 0.5, 
        x_view_window: aspect_ratio, 
        y_view_window: 1.0, 
        clip_depth: 0.1
    }
}


