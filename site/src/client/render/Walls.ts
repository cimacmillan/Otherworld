import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, GameMap, Ray, Vector2D, Wall } from "../types";
import { convert_unit, interpolate, vec_cross, vec_rotate, vec_sub } from "../util/math";
import { fastTextureMap } from "./Shader";

export function drawWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, walls: Wall[]) {

    const halfView = camera.x_view_window / 2;

    // Loop over all of the pixels
    for (let x = 0; x < screen.width; x++) {
        // Proper focal length and viewing angle
        const x_grad = convert_unit(x, screen.width, -halfView, halfView);
        const direction = vec_rotate({ x: x_grad, y: -camera.focal_length }, camera.angle);
        const origin = camera.position;
        const theta = Math.atan(x_grad / -camera.focal_length);

        const intersecting_rays = fire_ray(origin, direction, camera, walls);

        intersecting_rays.forEach((ray) => drawWall(x, ray, screen, theta, camera, depth_buffer));
    }
}

function fire_ray(origin: Vector2D, direction: Vector2D, camera: Camera, walls: Wall[]) {

    const intersecting_rays: Ray[] = [];

    walls.forEach((wall) => {

        const wall_direction = vec_sub(wall.p1, wall.p0);

        // Funky maths
        const wall_interpolation = (vec_cross(origin, direction) - vec_cross(wall.p0, direction)) / vec_cross(wall_direction, direction);
        const ray_interpolation = (vec_cross(wall.p0, wall_direction) - vec_cross(origin, wall_direction)) / vec_cross(direction, wall_direction);

        if (wall_interpolation >= 0 && wall_interpolation <= 1 && ray_interpolation > camera.clip_depth) {

            const intersection = { x: origin.x + ray_interpolation * direction.x, y: origin.y + ray_interpolation * direction.y };
            const length = Math.sqrt(Math.pow(intersection.x - origin.x, 2) + Math.pow(intersection.y - origin.y, 2));

            intersecting_rays.push({
                wall,
                wall_interpolation,
                ray_interpolation,
                origin,
                direction,
                intersection,
                length,
            });
        }

    });

    return intersecting_rays;
}

function drawWall(x: number, ray: Ray, screen: ScreenBuffer, theta: number, camera: Camera, depth_buffer: DepthBuffer) {
    const { texture, texcoord } = ray.wall;
    const alpha = ray.wall_interpolation;

    const upper_wall_z = -interpolate(alpha, ray.wall.height0 + ray.wall.offset0 - camera.height, ray.wall.height1 + ray.wall.offset1 - camera.height);
    const lower_wall_z = -interpolate(alpha, ray.wall.offset0 - camera.height, ray.wall.offset1 - camera.height);
    const u = interpolate(alpha, texcoord.start.x, texcoord.end.x);

    const distance = ray.length * Math.cos(theta);

    let upper_pixel = ((upper_wall_z / distance) * camera.focal_length * camera.y_view_window + 0.5) * screen.height;
    let lower_pixel = ((lower_wall_z / distance) * camera.focal_length * camera.y_view_window + 0.5) * screen.height;

    const temp = upper_pixel;
    upper_pixel = Math.min(upper_pixel, lower_pixel);
    lower_pixel = Math.max(temp, lower_pixel);

    const original_upper = ~~(upper_pixel);
    const original_height = Math.ceil(lower_pixel - upper_pixel) + 1;

    upper_pixel = Math.max(0, upper_pixel);
    lower_pixel = Math.min(screen.height - 1, lower_pixel);

    for (let y = ~~upper_pixel; y <= ~~lower_pixel; y++) {
        if (depth_buffer.isCloser(x, y, ray.length)) {
            const beta = (y - original_upper) / original_height;
            const v = (texcoord.end.y * beta) + ((1.0 - beta) * texcoord.start.y);
            const colour = fastTextureMap(texture, u, v);

            if (colour.a < 255) { continue; }

            depth_buffer.setDistance(x, y, ray.length);
            screen.putPixelColour(x, y, colour);
        }
    }

}
