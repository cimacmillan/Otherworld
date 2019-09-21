
class Wall {
    constructor(p0, p1) {
        this.p0 = p0;
        this.p1 = p1;
    }
}

class Map {
    constructor(wall_buffer) {
        this.wall_buffer = wall_buffer;
    }
}

class Camera {
    constructor(position, angle, focal_length) {
        this.position = position;
        this.angle = angle;
        this.focal_length = focal_length;
    }
}

wall_buffer = [];
wall_buffer.push(new Wall({x: 0.0, y: 0.0}, {x: 10.0, y: 0.0}))
wall_buffer.push(new Wall({x: 10.0, y: 0.0}, {x: 10.0, y: 10.0}))
wall_buffer.push(new Wall({x: 10.0, y: 10.0}, {x: 0.0, y: 10.0}))
wall_buffer.push(new Wall({x: 0.0, y: 10.0}, {x: 0.0, y: 0.0}))
var map = new Map(wall_buffer);

var camera = new Camera({x: 5.0, y: 8.0}, 0.0, 1.0)

