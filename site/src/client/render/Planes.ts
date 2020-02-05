import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, Plane, Colour } from "../types";
import { vec_add, vec_rotate } from "../util/math";
import { shade } from "./Shader";
import { start } from "repl";


// Draws fast when not rotated but then slows to a halt
// Do experiments to find why, remove line by line until chrome fails
export function drawPlanes(screen: ScreenBuffer, depthBuffer: DepthBuffer, camera: Camera, backgroundColour: Colour, floor?: Plane, ceiling?: Plane) {
    const cosTheta = Math.cos(camera.angle);
    const sinTheta = Math.sin(camera.angle);

    let startY = 0;
    let endY = screen.height;

    if (!floor) {
        endY = screen.height / 2;
    }

    if (!ceiling) {
        startY = screen.height / 2;
    }

    for (let y = startY; y < endY; y++) {

        let plane = floor;
        if (y < (screen.height / 2)) {
            plane = ceiling;
        }

        const yGrad = (y / screen.height);
        const yViewWindow = camera.y_view_window * (yGrad - 0.5);
        const heightDifference = (camera.height - plane.height);
        const yTilePreRotate = (camera.focal_length / yViewWindow) * heightDifference;
        const yTileCos = -yTilePreRotate * cosTheta;
        const yTileSin = yTilePreRotate * sinTheta;

        if (yTilePreRotate < camera.clip_depth || yTilePreRotate > camera.far_clip_depth || yTilePreRotate === Infinity) {
            continue;
        }

        for (let x = 0; x < screen.width; x++) {

            const xGrad = (x / screen.width);
            const xViewWindow = camera.x_view_window * (xGrad - 0.5);
            const xTilePreRotate = (xViewWindow / camera.focal_length) * yTilePreRotate;

            const tilePositionX = xTilePreRotate * cosTheta + yTileSin + camera.position.x;
            const tilePositionY = yTileCos + xTilePreRotate * sinTheta + camera.position.y;

            if (tilePositionX < plane.start.x ||
                tilePositionX > plane.end.x ||
                tilePositionY < plane.start.y ||
                tilePositionY > plane.end.y) {
                continue;
            }

            const tileX = ~~(tilePositionX - plane.start.x);
            const tileY = ~~(tilePositionY - plane.start.y);

            const texture = plane.spritesheet.data[tileX % plane.spritesheet.width][tileY % plane.spritesheet.height];

            const u = tilePositionX - tileX;
            const v = tilePositionY - tileY;

            const colour = shade(texture, u, v, yTilePreRotate, camera.far_clip_depth);
            screen.putPixelColour(x, y, colour, yTilePreRotate, camera.far_clip_depth, backgroundColour);

        }
    }

}
