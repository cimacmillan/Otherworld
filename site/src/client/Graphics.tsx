
import { camera, map } from "./Map"
import { Camera, Wall } from "./types/TypesMap"
import { Vector2D } from "./types/TypesVector"

export class DepthBuffer {

    data: number[];
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.data = Array(width * height).fill(0);
        this.width = width;
        this.height = height;
    }

    isCloser(x: number, y: number, distance: number) {
        let index = (y * this.width) + x;
        return 1.0 / distance > this.data[index];
    }

    setDistance(x: number, y: number, distance: number) {
        let index = (y * this.width) + x;
        this.data[index] = 1.0 / distance;
    }

    reset() {
        this.data = Array(this.width * this.height).fill(0);
    }
}

export class GameScreen {

    canvas: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    resolution_divisor: number;
    width: number;
    height: number;
    image_data: ImageData;

    constructor(canvas_element_name: string, resolution_divisor: number) {
        this.canvas = document.getElementById(canvas_element_name) as HTMLCanvasElement;
        this.canvas_context = this.canvas.getContext("2d");
        this.canvas_context.imageSmoothingEnabled = false;
        this.resolution_divisor = resolution_divisor;
        this.width = this.canvas.width / resolution_divisor;
        this.height = this.canvas.height / resolution_divisor;
        this.image_data = this.canvas_context.createImageData(this.width, this.height);
    }

    putPixel(x: number, y: number, red: number, green: number, blue: number, alpha: number) {
        var pixelindex = (y * this.width + x) * 4;
        this.image_data.data[pixelindex] = red;
        this.image_data.data[pixelindex + 1] = green;
        this.image_data.data[pixelindex + 2] = blue;
        this.image_data.data[pixelindex + 3] = alpha;

    }

    render_to_canvas() {
        this.canvas_context.putImageData(this.image_data, 0, 0);
        this.canvas_context.drawImage(this.canvas, 0, 0, this.resolution_divisor * this.canvas.width, this.resolution_divisor * this.canvas.height);
    }
}

function vec_cross(a: Vector2D, b: Vector2D) {
    return (a.x * b.y) - (a.y * b.x);
}

function vec_sub(a: Vector2D, b: Vector2D) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

export function vec_add(a: Vector2D, b: Vector2D) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}

function vec_divide(a: Vector2D, b: Vector2D) {
    return {
        x: a.x / b.x,
        y: a.y / b.y
    }
}

export function vec_rotate(a: Vector2D, theta: number) {
    return {
        x: a.x * Math.cos(theta) - a.y * Math.sin(theta),
        y: a.y * Math.cos(theta) + a.x * Math.sin(theta)
    }
}

function interpolate(alpha: number, a: number, b: number) {
    return (a * (1 - alpha)) + (b * alpha);
}

function convert_unit(x: number, range: number, a: number, b: number) {
    let grad = x / range;
    return interpolate(grad, a, b);
}

interface Ray {
    wall: Wall,
    wall_interpolation: number,
    ray_interpolation: number,
    origin: Vector2D,
    direction: Vector2D,
    intersection: Vector2D,
    length: number
}

function fire_ray(origin: Vector2D, direction: Vector2D) {

    let intersecting_rays: Ray[] = [];

    map.wall_buffer.forEach((wall) => {

        let wall_direction = vec_sub(wall.p1, wall.p0);

        //Funky maths
        let wall_interpolation = (vec_cross(origin, direction) - vec_cross(wall.p0, direction)) / vec_cross(wall_direction, direction);
        let ray_interpolation = (vec_cross(wall.p0, wall_direction) - vec_cross(origin, wall_direction)) / vec_cross(direction, wall_direction);

        if (wall_interpolation >= 0 && wall_interpolation <= 1 && ray_interpolation > camera.clip_depth) {

            let intersection = { x: origin.x + ray_interpolation * direction.x, y: origin.y + ray_interpolation * direction.y };
            let length = Math.sqrt(Math.pow(intersection.x - origin.x, 2) + Math.pow(intersection.y - origin.y, 2));

            intersecting_rays.push({
                wall: wall,
                wall_interpolation: wall_interpolation,
                ray_interpolation: ray_interpolation,
                origin: origin,
                direction: direction,
                intersection: intersection,
                length: length
            });
        }

    });

    return intersecting_rays;
}

function drawWall(x: number, ray: Ray, screen: GameScreen, theta: number, camera: Camera, depth_buffer: DepthBuffer) {

    let upper_wall_z = -interpolate(ray.wall_interpolation, ray.wall.height0 + ray.wall.offset0 - camera.height, ray.wall.height1 + ray.wall.offset1 - camera.height);
    let lower_wall_z = -interpolate(ray.wall_interpolation, ray.wall.offset0 - camera.height, ray.wall.offset1 - camera.height);
    let distance = ray.length * Math.cos(theta);

    let upper_pixel = ((upper_wall_z / distance) * camera.focal_length * camera.y_view_window + 0.5) * screen.height;
    let lower_pixel = ((lower_wall_z / distance) * camera.focal_length * camera.y_view_window + 0.5) * screen.height;

    let temp = upper_pixel;
    upper_pixel = Math.min(upper_pixel, lower_pixel);
    lower_pixel = Math.max(temp, lower_pixel);
    upper_pixel = Math.max(0, upper_pixel);
    lower_pixel = Math.min(screen.height - 1, lower_pixel);

    for (var y = Math.floor(upper_pixel); y < Math.floor(lower_pixel); y++) {

        if (depth_buffer.isCloser(x, y, ray.length)) {
            depth_buffer.setDistance(x, y, ray.length);
            screen.putPixel(x, y,
                255,
                ((ray.intersection.x % 2) / 2) * 255,
                ((ray.intersection.y % 2) / 2) * 255,
                255);
        }
    }

}

export function createImage(screen: GameScreen, depth_buffer: DepthBuffer) {

    depth_buffer.reset();

    // Loop over all of the pixels
    for (var x = 0; x < screen.width; x++) {

        for (var y = 0; y < screen.height; y++) {
            screen.putPixel(x, y, 0, 0, 0, 255);
        }

        // Proper focal length and viewing angle

        let x_grad = convert_unit(x, screen.width, -camera.x_view_window, camera.x_view_window);
        let direction = vec_rotate({ x: x_grad, y: -camera.focal_length }, camera.angle);
        let origin = camera.position;
        let theta = Math.atan(x_grad / -camera.focal_length);

        let intersecting_rays = fire_ray(origin, direction);

        intersecting_rays.forEach((ray) => drawWall(x, ray, screen, theta, camera, depth_buffer));

    }
}



