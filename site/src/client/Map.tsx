
interface Vector2D {
    x: number,
    y: number
}

export class Wall {
    public p0: Vector2D;
    public p1: Vector2D;
    public height0: number;
    public height1: number;
    public offset0: number;
    public offset1: number;
    constructor(p0: Vector2D, p1: Vector2D, height0: number, height1: number, offset0: number, offset1: number) {
        this.p0 = p0;
        this.p1 = p1;
        this.height0 = height0;
        this.height1 = height1;
        this.offset0 = offset0;
        this.offset1 = offset1;
    }
}

class GameMap {
    public wall_buffer: Wall[];
    constructor(wall_buffer: Wall[]) {
        this.wall_buffer = wall_buffer;
    }
}

export class Camera {
    position: Vector2D;
    angle: number;
    focal_length: number;
    height: number;
    x_view_window: number;
    y_view_window: number;
    clip_depth: number
    constructor(position: Vector2D, angle: number, focal_length: number, height: number, x_view_window: number, y_view_window: number, clip_depth: number) {
        this.position = position;
        this.angle = angle;
        this.focal_length = focal_length;
        this.height = height;
        this.x_view_window = x_view_window;
        this.y_view_window = y_view_window;
        this.clip_depth = clip_depth;
    }
}

export var wall_buffer: Wall[];
export var map: GameMap;
export var camera: Camera;

export function initialiseMap(screen: Screen) {

    wall_buffer = [];
    wall_buffer.push(new Wall({ x: 0.0, y: 0.0 }, { x: 10.0, y: 0.0 }, 0.5, 1, 0, 0))
    wall_buffer.push(new Wall({ x: 10.0, y: 0.0 }, { x: 10.0, y: 10.0 }, 1, 1, 0, 0.5))
    wall_buffer.push(new Wall({ x: 10.0, y: 10.0 }, { x: 0.0, y: 10.0 }, 1, 1, 0.5, 0))
    wall_buffer.push(new Wall({ x: 0.0, y: 10.0 }, { x: 0.0, y: 0.0 }, 1, 0.5, 0, 0))
    map = new GameMap(wall_buffer);

    let aspect_ratio = (screen.width / screen.height);
    let viewing_angle = 80;
    let radians = (viewing_angle / 180.0) * Math.PI;
    let focal_length = aspect_ratio / Math.tan(radians / 2);
    camera = new Camera({ x: 5.0, y: 8.0 }, 0.0, focal_length, 0.5, aspect_ratio, 1.0, 0.1);
}


