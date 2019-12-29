import { ScreenBuffer, DepthBuffer } from ".";
import { Camera, Plane } from "../types";
import { vec_rotate, vec_add } from "../util/math";

export function drawPlanes(screen: ScreenBuffer, depthBuffer: DepthBuffer, camera: Camera, planes: Plane[]) {

    for(let y = 0; y < screen.height; y++) {

        let yGrad = (y / screen.height);
        let yViewWindow = camera.y_view_window * (yGrad - 0.5);
        let heightDifference = (camera.height - planes[0].height);
        let yTilePreRotate = (camera.focal_length /yViewWindow) * heightDifference;

        for(let x = 0; x < screen.width; x++) {

            depthBuffer.forceSet(x, y, 0);

            if (yTilePreRotate < 0) {
                // depthBuffer.forceSet(x, y, 0);
                screen.putPixel(x, y, 0, 0, 0, 255);
                continue;
            }

            let xGrad = (x / screen.width);
            let xViewWindow = camera.x_view_window * (xGrad - 0.5);
            let xTilePreRotate = (xViewWindow / camera.focal_length) * yTilePreRotate;

            let tilePosition = vec_add(vec_rotate({x: xTilePreRotate, y: -yTilePreRotate}, camera.angle), camera.position);

            let yTileGrad = (tilePosition.y % 1);
            let xTileGrad = tilePosition.x < 0 ? 1.0 + (tilePosition.x % 1) : tilePosition.x % 1;

            let red = yTileGrad * 255;
            let green = xTileGrad * 255;

            // depthBuffer.setDistance(x, y, distance);
            screen.putPixel(x, y, red, green, 0, 255);

        }
    }

}