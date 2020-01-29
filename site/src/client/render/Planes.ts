import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, Plane } from "../types";
import { vec_add, vec_rotate } from "../util/math";
import { fastTextureMap } from "./Shader";

export function drawPlanes(screen: ScreenBuffer, depthBuffer: DepthBuffer, camera: Camera, planes: Plane[]) {

    const plane = planes[0];

    for (let y = 0; y < screen.height; y++) {

        const yGrad = (y / screen.height);
        const yViewWindow = camera.y_view_window * (yGrad - 0.5);
        const heightDifference = (camera.height - planes[0].height);
        const yTilePreRotate = (camera.focal_length / yViewWindow) * heightDifference;

        for (let x = 0; x < screen.width; x++) {

            depthBuffer.forceSet(x, y, 0);

            const xGrad = (x / screen.width);
            const xViewWindow = camera.x_view_window * (xGrad - 0.5);
            const xTilePreRotate = (xViewWindow / camera.focal_length) * yTilePreRotate;

            const tilePosition = vec_add(vec_rotate({x: xTilePreRotate, y: -yTilePreRotate}, camera.angle), camera.position);

            if (yTilePreRotate < 0 ||
                tilePosition.x < plane.start.x ||
                tilePosition.x > plane.end.x ||
                tilePosition.y < plane.start.y ||
                tilePosition.y > plane.end.y) {
                screen.putPixel(x, y, 0, 0, 0, 255);
                continue;
            }

            const tileX = ~~(tilePosition.x - plane.start.x);
            const tileY = ~~(tilePosition.y - plane.start.y);

            const texture = plane.spritesheet.data[tileX % plane.spritesheet.width][tileY % plane.spritesheet.height];

            const u = tilePosition.x - tileX;
            const v = tilePosition.y - tileY;

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
