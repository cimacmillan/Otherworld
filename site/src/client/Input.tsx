
import { Camera } from "./types";
import { vec_add, vec_rotate } from "./util/math/Vector";
import { fpsNorm } from "./util/time/GlobalFPSController";

const keys_down_set: any = {};

export function initialiseInput() {
    window.addEventListener("keydown", keyboardInput);
    window.addEventListener("keyup", keyboardInput);
}

function isKeyDown(key: string) {
    return keys_down_set[key] == true;
}

function keyboardInput(e: KeyboardEvent) {
    keys_down_set[e.code] = (e.type == "keydown") ? true : false;
}

export function updateInput(camera: Camera) {

    const speed = fpsNorm(0.1);

    if (isKeyDown("KeyW")) {
        const camera_add = vec_rotate({ x: 0, y: -speed }, camera.angle);
        camera.position = vec_add(camera.position, camera_add);
    }
    if (isKeyDown("KeyS")) {
        const camera_add = vec_rotate({ x: 0, y: speed }, camera.angle);
        camera.position = vec_add(camera.position, camera_add);
    }
    if (isKeyDown("KeyA")) {
        const camera_add = vec_rotate({ x: -speed, y: 0 }, camera.angle);
        camera.position = vec_add(camera.position, camera_add);
    }
    if (isKeyDown("KeyD")) {
        const camera_add = vec_rotate({ x: speed, y: 0 }, camera.angle);
        camera.position = vec_add(camera.position, camera_add);
    }

    if (isKeyDown("Space")) {
        camera.height += speed;
    }
    if (isKeyDown("ShiftLeft")) {
        camera.height -= speed;
    }

    if (isKeyDown("ArrowLeft")) {
        camera.angle -= speed / 3;
    }
    if (isKeyDown("ArrowRight")) {
        camera.angle += speed / 3;
    }

}
