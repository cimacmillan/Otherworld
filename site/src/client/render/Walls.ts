import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, Ray, Vector2D, Wall } from "../types";
import { convert_unit, interpolate, vec_cross, vec_rotate, vec_sub, clipToRange } from "../util/math";
import { fastTextureMap } from "./Shader";

export function drawWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, walls: Wall[]) {
    // return drawRaycastedWalls(screen, depth_buffer, camera, walls);
    return drawRasterisedWalls(screen, depth_buffer, camera, walls);
}


function drawRasterisedWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, walls: Wall[]) {
    for (let wallIndex = 0; wallIndex < walls.length; wallIndex++) {
        const wall = walls[wallIndex];
        const texcoord = wall.texcoord;
        const texture = wall.texture;

        const wallA = vec_rotate(vec_sub(wall.p0, camera.position), -camera.angle);
        const wallB = vec_rotate(vec_sub(wall.p1, camera.position), -camera.angle);
        let distanceA = -wallA.y;
        let distanceB = -wallB.y;
        let wallX1 = wallA.x;
        let wallX2 = wallB.x;
        let wallU1 = texcoord.start.x;
        let wallU2 = texcoord.end.x;
        let wallYT1 = -(wall.height0 + wall.offset0 - camera.height);
        let wallYT2 = -(wall.height1 + wall.offset1 - camera.height);
        let wallYB1 = -(wall.offset0 - camera.height);
        let wallYB2 = -(wall.offset1 - camera.height);

        if (distanceA < camera.clip_depth && distanceB < camera.clip_depth ) {
            continue;
        }

        if (distanceA > camera.far_clip_depth && distanceB > camera.far_clip_depth ) {
            continue;
        }

        if (distanceA < camera.clip_depth) {
            const depthAlpha = (camera.clip_depth - distanceA) / (distanceB - distanceA);
            wallX1 = wallX1 + (wallX2 - wallX1) * depthAlpha;
            wallU1 = wallU1 + (wallU2 - wallU1) * depthAlpha;
            wallYT1 = wallYT1 + (wallYT2 - wallYT1) * depthAlpha;
            wallYB1 = wallYB1 + (wallYB2 - wallYB1) * depthAlpha;
            distanceA = camera.clip_depth;
        }

        if (distanceB < camera.clip_depth) {
            const depthAlpha = (camera.clip_depth - distanceB) / (distanceA - distanceB);
            wallX2 = wallX2 + (wallX1 - wallX2) * depthAlpha;
            wallU2 = wallU2 + (wallU1 - wallU2) * depthAlpha;
            wallYT2 = wallYT2 + (wallYT1 - wallYT2) * depthAlpha;
            wallYB2 = wallYB2 + (wallYB1 - wallYB2) * depthAlpha;
            distanceB = camera.clip_depth;
        }

        if (distanceA > camera.far_clip_depth) {
            const depthAlpha = (camera.far_clip_depth - distanceA) / (distanceB - distanceA);
            wallX1 = wallX1 + (wallX2 - wallX1) * depthAlpha;
            wallU1 = wallU1 + (wallU2 - wallU1) * depthAlpha;
            wallYT1 = wallYT1 + (wallYT2 - wallYT1) * depthAlpha;
            wallYB1 = wallYB1 + (wallYB2 - wallYB1) * depthAlpha;
            distanceA = camera.far_clip_depth;
        }

        if (distanceB > camera.far_clip_depth) {
            const depthAlpha = (camera.far_clip_depth - distanceB) / (distanceA - distanceB);
            wallX2 = wallX2 + (wallX1 - wallX2) * depthAlpha;
            wallU2 = wallU2 + (wallU1 - wallU2) * depthAlpha;
            wallYT2 = wallYT2 + (wallYT1 - wallYT2) * depthAlpha;
            wallYB2 = wallYB2 + (wallYB1 - wallYB2) * depthAlpha;
            distanceB = camera.far_clip_depth;
        }

        const wallAX = ((wallX1 * camera.focal_length * screen.height) / distanceA) + (0.5 * screen.width);
        const wallBX = ((wallX2 * camera.focal_length * screen.height) / distanceB) + (0.5 * screen.width);

        const clipX1 = clipToRange(wallAX, 0, screen.width - 1);
        const clipX2 = clipToRange(wallBX, 0, screen.width - 1);

        const x1 = Math.min(clipX1, clipX2);
        const x2 = Math.max(clipX1, clipX2);

        const persp = (p: number, z: number) =>  ((p / z) * camera.focal_length * camera.y_view_window + 0.5) * screen.height;

        const upper_pixel_start = persp(wallYT1, distanceA);
        const upper_pixel_end = persp(wallYT2, distanceB);
        const lower_pixel_start = persp(wallYB1, distanceA);
        const lower_pixel_end = persp(wallYB2, distanceB);

        const zinv_start = 1.0 / distanceA;
        const zinv_end = 1.0 / distanceB;

        const u_start = wallU1 * zinv_start;
        const u_end = wallU2 * zinv_end;

        for (let x = x1; x < x2; x++) {

            const alpha = (x - wallAX) / (wallBX - wallAX);
            const distance = 1.0 / (((1.0 - alpha) * zinv_start) + (alpha * zinv_end));

            const upper_pixel = ((1.0 - alpha) * upper_pixel_start) + (alpha * upper_pixel_end);
            const lower_pixel = ((1.0 - alpha) * lower_pixel_start) + (alpha * lower_pixel_end);
            
            const upper_pixel_in_range = Math.min(Math.max(0, upper_pixel), screen.height - 1);
            const lower_pixel_in_range = Math.min(Math.max(0, lower_pixel), screen.height - 1);

            const u = (((1.0 - alpha) * u_start) + (alpha * u_end)) * distance;

            for (let y = upper_pixel_in_range; y <= lower_pixel_in_range; y++) {

                if (depth_buffer.isCloser(~~x, ~~y, distance)) {
                    const beta = (y - upper_pixel) / (lower_pixel - upper_pixel);
                    const v = (texcoord.end.y * beta) + ((1.0 - beta) * texcoord.start.y);

                    const colour = fastTextureMap(texture, u, v);

                    if (colour === undefined || colour.a < 255) { continue; }

                    depth_buffer.setDistance(~~x, ~~y, distance);
                    screen.putPixelColour(~~x, ~~y, colour);
                }
            }
        }
    }
}

function drawRaycastedWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, walls: Wall[]) {
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
