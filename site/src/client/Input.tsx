import { vec_add, vec_rotate } from "./render/Graphics"
import { fpsNorm } from "./util/time/GlobalFPSController";
import { Camera } from "./types/TypesMap";

var keys_down_set: any = {};

export function initialiseInput() {
    window.addEventListener('keydown', keyboardInput);
    window.addEventListener('keyup', keyboardInput);
}

function isKeyDown(key: string) {
    return keys_down_set[key] == true;
}

function keyboardInput(e: KeyboardEvent) {
    keys_down_set[e.code] = (e.type == "keydown") ? true : false;
}

export function updateInput(camera: Camera) {

    let speed = fpsNorm(0.1);

    if (isKeyDown("KeyW")) {
        let camera_add = vec_rotate({ x: 0, y: -speed }, camera.angle);
        camera.position = vec_add(camera.position, camera_add);
    }
    if (isKeyDown("KeyS")) {
        let camera_add = vec_rotate({ x: 0, y: speed }, camera.angle);
        camera.position = vec_add(camera.position, camera_add);
    }
    if (isKeyDown("KeyA")) {
        let camera_add = vec_rotate({ x: -speed, y: 0 }, camera.angle);
        camera.position = vec_add(camera.position, camera_add);
    }
    if (isKeyDown("KeyD")) {
        let camera_add = vec_rotate({ x: speed, y: 0 }, camera.angle);
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
