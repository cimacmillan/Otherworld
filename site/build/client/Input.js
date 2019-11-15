"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graphics_1 = require("./render/Graphics");
const Map_1 = require("./Map");
var keys_down_set = {};
function initialiseInput() {
    window.addEventListener('keydown', keyboardInput);
    window.addEventListener('keyup', keyboardInput);
}
exports.initialiseInput = initialiseInput;
function isKeyDown(key) {
    return keys_down_set[key] == true;
}
function keyboardInput(e) {
    keys_down_set[e.code] = (e.type == "keydown") ? true : false;
}
function updateInput() {
    let speed = 0.1;
    if (isKeyDown("KeyW")) {
        let camera_add = Graphics_1.vec_rotate({ x: 0, y: -speed }, Map_1.camera.angle);
        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);
    }
    if (isKeyDown("KeyS")) {
        let camera_add = Graphics_1.vec_rotate({ x: 0, y: speed }, Map_1.camera.angle);
        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);
    }
    if (isKeyDown("KeyA")) {
        let camera_add = Graphics_1.vec_rotate({ x: -speed, y: 0 }, Map_1.camera.angle);
        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);
    }
    if (isKeyDown("KeyD")) {
        let camera_add = Graphics_1.vec_rotate({ x: speed, y: 0 }, Map_1.camera.angle);
        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);
    }
    if (isKeyDown("Space")) {
        Map_1.camera.height += speed;
    }
    if (isKeyDown("ShiftLeft")) {
        Map_1.camera.height -= speed;
    }
    if (isKeyDown("ArrowLeft")) {
        Map_1.camera.angle -= speed / 3;
    }
    if (isKeyDown("ArrowRight")) {
        Map_1.camera.angle += speed / 3;
    }
}
exports.updateInput = updateInput;
//# sourceMappingURL=Input.js.map