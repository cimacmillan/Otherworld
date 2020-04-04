import { GameEvent } from "../engine/events/Event";
import { vec_add, vec_rotate } from "../util/math";
import { fpsNorm } from "../util/time/GlobalFPSController";
import { GameEventSource } from "./EventRouter";
import { ServiceLocator } from "./ServiceLocator";

/**
 * Service for handling input and window events
 */
export class InputService {
    private keys_down_set: any = {};
    private serviceLocator: ServiceLocator;

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.serviceLocator
            .getEventRouter()
            .attachEventListener(GameEventSource.INPUT, this.onGameEvent);
        this.attachWindowHooks();
    }

    private attachWindowHooks() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private onKeyUp(keyboardEvent: KeyboardEvent) {}

    private onKeyDown(keyboardEvent: KeyboardEvent) {}

    private isKeyDown(key: string) {
        return this.keys_down_set[key] == true;
    }

    private poll() {
        const speed = fpsNorm(0.1);
        const camera: any = 1;

        if (this.isKeyDown("KeyW")) {
            const camera_add = vec_rotate({ x: 0, y: -speed }, camera.angle);
            camera.position = vec_add(camera.position, camera_add);
        }
        if (this.isKeyDown("KeyS")) {
            const camera_add = vec_rotate({ x: 0, y: speed }, camera.angle);
            camera.position = vec_add(camera.position, camera_add);
        }
        if (this.isKeyDown("KeyA")) {
            const camera_add = vec_rotate({ x: -speed, y: 0 }, camera.angle);
            camera.position = vec_add(camera.position, camera_add);
        }
        if (this.isKeyDown("KeyD")) {
            const camera_add = vec_rotate({ x: speed, y: 0 }, camera.angle);
            camera.position = vec_add(camera.position, camera_add);
        }

        if (this.isKeyDown("Space")) {
            camera.height += speed;
        }
        if (this.isKeyDown("ShiftLeft")) {
            camera.height -= speed;
        }

        if (this.isKeyDown("ArrowLeft")) {
            camera.angle -= speed / 3;
        }
        if (this.isKeyDown("ArrowRight")) {
            camera.angle += speed / 3;
        }
    }

    private onGameEvent(event: GameEvent, source: GameEventSource) {}
}
