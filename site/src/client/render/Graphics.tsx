
import { ScreenBuffer } from "./ScreenBuffer";
import { DepthBuffer } from "./DepthBuffer";
import { vec_sub, vec_cross, vec_rotate } from "../util/math/Vector";
import { interpolate, convert_unit } from "../util/math/Basic";
import { Ray, Vector2D, GameMap, Camera, Sprite } from "../types";
import { WorldState } from "../state/world/WorldState";
import { RenderState } from "../state/render/RenderState";
import { swapSort } from "../util/math";

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

function drawWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, map: GameMap, camera: Camera) {

    // Loop over all of the pixels
    for (var x = 0; x < screen.width; x++) {
        // Proper focal length and viewing angle
        let x_grad = convert_unit(x, screen.width, -camera.x_view_window, camera.x_view_window);
        let direction = vec_rotate({ x: x_grad, y: -camera.focal_length }, camera.angle);
        let origin = camera.position;
        let theta = Math.atan(x_grad / -camera.focal_length);

        let intersecting_rays = fire_ray(origin, direction, map, camera);

        intersecting_rays.forEach((ray) => drawWall(x, ray, screen, theta, camera, depth_buffer));
    }
}

function drawSprite(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprite: Sprite) {
    const projectPosition = sprite.projectPosition!;

    // Angle of 0 is looking up
    projectPosition.y = -projectPosition.y;

    if (projectPosition.y < camera.clip_depth) {
        return;
    }

    const distance = projectPosition.y;
    const projectMult = (camera.focal_length / distance);

    let width = sprite.size.x * projectMult * camera.y_view_window * screen.height; 
    let height = sprite.size.y * projectMult  * camera.y_view_window * screen.height;

    let x = ((projectPosition.x / distance) * screen.height) + (0.5 * screen.width);
    let y = (((-sprite.height + camera.height) * projectMult) * camera.y_view_window + 0.5) * screen.height;

    let x1 = Math.floor(x - width/2);
    let x2 = Math.floor(x + width/2);
    let y1 = Math.floor(y - height/2);
    let y2 = Math.floor(y + height/2);

    if(x1 < 0) x1 = 0;
    if(x2 < 0) x2 = 0;
    if(y1 < 0) y1 = 0;
    if(y2 < 0) y2 = 0;
    if(x1 >= screen.width) x1 = screen.width-1;
    if(x2 >= screen.width) x2 = screen.width-1;
    if(y1 >= screen.height) y1 = screen.height-1;
    if(y2 >= screen.height) y2 = screen.height-1;

    for (let xPixel = x1; xPixel < x2; xPixel++) {
        for (let yPixel = y1; yPixel < y2; yPixel++) {
            screen.putPixelColour(xPixel, yPixel, sprite.colour);
            depth_buffer.setDistance(xPixel, yPixel, projectPosition.y);
        }
    }

}

function drawSprites(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprites: Sprite[]) {
    sprites.forEach((sprite) => {
        sprite.projectPosition = vec_rotate(vec_sub(sprite.position, camera.position), -camera.angle)
    })
    
    swapSort(sprites, (spriteA, spriteB) => (spriteA.projectPosition!.y < spriteB.projectPosition!.y));

    sprites.forEach((sprite) => {
        drawSprite(screen, depth_buffer, camera, sprite);
    });
}

export function createImage(renderState: RenderState, worldState: WorldState) {

    const {screen, depthBuffer} = renderState;

    depthBuffer.reset();
    screen.reset();

    drawSprites(screen, depthBuffer, worldState.camera, worldState.map.sprites);
    drawWalls(screen, depthBuffer, worldState.map, worldState.camera);

}



