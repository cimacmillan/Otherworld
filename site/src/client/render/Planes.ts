import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, Plane } from "../types";
import { vec_add, vec_rotate } from "../util/math";
import { fastTextureMap } from "./Shader";

export function drawPlanes(screen: ScreenBuffer, depthBuffer: DepthBuffer, camera: Camera, planes: Plane[]) {

    const plane = planes[0];

    let startY = 0;
    let endY = screen.height;

    if (camera.height > plane.height) {
        startY = screen.height / 2;
    }

    if (camera.height < plane.height) {
        endY = screen.height / 2;
    }

    const cosTheta = Math.cos(camera.angle);
    const sinTheta = Math.sin(camera.angle);

    for (let y = startY; y < endY; y++) {

        const yGrad = (y / screen.height);
        const yViewWindow = camera.y_view_window * (yGrad - 0.5);
        const heightDifference = (camera.height - planes[0].height);
        const yTilePreRotate = (camera.focal_length / yViewWindow) * heightDifference;

        if (yTilePreRotate <= 0 || yTilePreRotate === Infinity) {
            continue;
        }

        for (let x = 0; x < screen.width; x++) {

            const xGrad = (x / screen.width);
            const xViewWindow = camera.x_view_window * (xGrad - 0.5);
            const xTilePreRotate = (xViewWindow / camera.focal_length) * yTilePreRotate;

            const tilePositionX = (xTilePreRotate * cosTheta + yTilePreRotate * sinTheta) + camera.position.x;
            const tilePositionY = (-yTilePreRotate * cosTheta + xTilePreRotate * sinTheta) + camera.position.y;

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

            const colour = fastTextureMap(texture, u, v);

            if (colour.a < 255) {
                screen.putPixel(x, y, 0, 0, 0, 255);
                continue;
            }

            // depthBuffer.setDistance(x, y, distance);
            screen.putPixelColour(x, y, colour);

        }
    }

}
