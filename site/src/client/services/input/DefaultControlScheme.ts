import { vec_add, vec_rotate } from "../../util/math";
import { fpsNorm } from "../../util/time/GlobalFPSController";
import { ServiceLocator } from "../ServiceLocator";
import { ControlScheme } from "./ControlScheme";

export class DefaultControlScheme implements ControlScheme {
    public constructor(private serviceLocator: ServiceLocator) {}

    public poll(keysDown: { [key: string]: boolean }) {
        const speed = fpsNorm(0.1);
        const playerState = this.serviceLocator
            .getScriptingService()
            .getPlayer()
            .getState();

        if (keysDown.KeyW) {
            const camera_add = vec_rotate(
                { x: 0, y: -speed },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }
        if (keysDown.KeyS) {
            const camera_add = vec_rotate(
                { x: 0, y: speed },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }
        if (keysDown.KeyA) {
            const camera_add = vec_rotate(
                { x: -speed, y: 0 },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }
        if (keysDown.KeyD) {
            const camera_add = vec_rotate(
                { x: speed, y: 0 },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }

        if (keysDown.Space) {
            playerState.height += speed;
        }
        if (keysDown.ShiftLeft) {
            playerState.height -= speed;
        }

        if (keysDown.ArrowLeft) {
            playerState.angle -= speed / 3;
        }
        if (keysDown.ArrowRight) {
            playerState.angle += speed / 3;
        }
    }

    public onKeyDown(key: string, keysDown: { [key: string]: boolean }) {}

    public onKeyUp(key: string, keysDown: { [key: string]: boolean }) {}
}
