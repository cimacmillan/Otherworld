
class Wall {
    constructor(p0, p1, height0, height1, offset0, offset1) {
        this.p0 = p0;
        this.p1 = p1;
        this.height0 = height0;
        this.height1 = height1;
        this.offset0 = offset0;
        this.offset1 = offset1;
    }
}

class Map {
    constructor(wall_buffer) {
        this.wall_buffer = wall_buffer;
    }
}

class Camera {
    constructor(position, angle, focal_length, height, x_view_window, y_view_window, clip_depth) {
        this.position = position;
        this.angle = angle;
        this.focal_length = focal_length;
        this.height = height;
        this.x_view_window = x_view_window;
        this.y_view_window = y_view_window;
        this.clip_depth = clip_depth;
    }
}

var wall_buffer;
var map;
var camera;

function initialiseMap(screen) {

    wall_buffer = [];
    wall_buffer.push(new Wall({x: 0.0, y: 0.0}, {x: 10.0, y: 0.0}, 1, 1, 0, 0))
    wall_buffer.push(new Wall({x: 10.0, y: 0.0}, {x: 10.0, y: 10.0}, 1, 1, 0, 0))
    wall_buffer.push(new Wall({x: 10.0, y: 10.0}, {x: 0.0, y: 10.0}, 1, 1, 0, 0))
    wall_buffer.push(new Wall({x: 0.0, y: 10.0}, {x: 0.0, y: 0.0}, 1, 1, 0, 0))
    map = new Map(wall_buffer);

    let aspect_ratio = (screen.width / screen.height);
    let viewing_angle = 80;
    let radians = (viewing_angle / 180.0) * Math.PI;
    let focal_length = aspect_ratio / Math.tan(radians / 2);
    camera = new Camera({x: 5.0, y: 8.0}, 0.0, focal_length, 0.5, aspect_ratio, 1.0, 0.1);
}


