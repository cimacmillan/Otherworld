import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, Ray, Vector2D, Wall, Colour } from "../types";
import { convert_unit, interpolate, vec_cross, vec_rotate, vec_sub, clipToRange } from "../util/math";
import { shade } from "./Shader";

export function drawWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, walls: Wall[], backgroundColour: Colour) {
    // return drawRaycastedWalls(screen, depth_buffer, camera, walls);
    return drawRasterisedWalls(screen, depth_buffer, camera, walls, backgroundColour);
}


function drawRasterisedWalls(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, walls: Wall[], backgroundColour: Colour) {
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
            
            const upper_pixel_in_range = upper_pixel >= screen.height ? screen.height - 1 : (upper_pixel < 0 ? 0 : upper_pixel);
            const lower_pixel_in_range = upper_pixel >= screen.height ? screen.height - 1 : (lower_pixel < 0 ? 0 : lower_pixel);

            const u = (((1.0 - alpha) * u_start) + (alpha * u_end)) * distance;

            for (let y = upper_pixel_in_range; y <= lower_pixel_in_range; y++) {

                if (depth_buffer.isCloser(~~x, ~~y, distance)) {
                    const beta = (y - upper_pixel) / (lower_pixel - upper_pixel);
                    const v = (texcoord.end.y * beta) + ((1.0 - beta) * texcoord.start.y);

                    const colour = shade(texture, u, v, distance, camera.far_clip_depth);

                    if (colour && colour.a > 0) {     
                        depth_buffer.setDistance(~~x, ~~y, distance);
                        screen.putPixelColour(~~x, ~~y, colour, distance, camera.far_clip_depth, backgroundColour);
                    }
                }
            }
        }
    }
}

