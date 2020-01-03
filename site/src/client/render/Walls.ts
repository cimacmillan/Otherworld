import { Vector2D, GameMap, Camera, Ray } from "../types";
import { vec_sub, vec_cross, interpolate, convert_unit, vec_rotate } from "../util/math";
import { ScreenBuffer, DepthBuffer } from ".";

function fire_ray(origin: Vector2D, direction: Vector2D, map: GameMap, camera: Camera) {

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

function drawWall(x: number, ray: Ray, screen: ScreenBuffer, theta: number, camera: Camera, depth_buffer: DepthBuffer) {

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

    for (var y = Math.floor(upper_pixel); y <= Math.floor(lower_pixel); y++) {

        if (depth_buffer.isCloser(x, y, ray.length)) {
            depth_buffer.setDistance(x, y, ray.length);
            screen.putPixel(x, y,
                255,
                (ray.intersection.x % 1) * 255,
                (ray.intersection.y % 1) * 255,
                255);
        }
    }

}

export function drawWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, map: GameMap, camera: Camera) {

    const halfView = camera.x_view_window / 2;

    // Loop over all of the pixels
    for (var x = 0; x < screen.width; x++) {
        // Proper focal length and viewing angle
        let x_grad = convert_unit(x, screen.width, -halfView, halfView);
        let direction = vec_rotate({ x: x_grad, y: -camera.focal_length }, camera.angle);
        let origin = camera.position;
        let theta = Math.atan(x_grad / -camera.focal_length);

        let intersecting_rays = fire_ray(origin, direction, map, camera);

        intersecting_rays.forEach((ray) => drawWall(x, ray, screen, theta, camera, depth_buffer));
    }
}

