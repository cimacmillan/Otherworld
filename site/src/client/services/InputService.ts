import { GameEvent } from "../engine/events/Event";
import { vec_add, vec_rotate } from "../util/math";
import { fpsNorm } from "../util/time/GlobalFPSController";
import { GameEventSource } from "./EventRouter";
import { ServiceLocator } from "./ServiceLocator";

/**
 * Service for handling input and window events
 * Depending on what state we're in, changes what commands
 * are fired.
 */
export class InputService {
    private keydown: { [key: string]: boolean };
    private serviceLocator: ServiceLocator;

    public constructor() {
        this.keydown = {};
    }

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.serviceLocator
            .getEventRouter()
            .attachEventListener(GameEventSource.INPUT, this.onGameEvent);
        this.attachWindowHooks();
    }

    public update() {
        const speed = fpsNorm(0.1);
        const playerState = this.serviceLocator
            .getScriptingService()
            .getPlayer()
            .getState();

        if (this.isKeyDown("KeyW")) {
            const camera_add = vec_rotate(
                { x: 0, y: -speed },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }
        if (this.isKeyDown("KeyS")) {
            const camera_add = vec_rotate(
                { x: 0, y: speed },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }
        if (this.isKeyDown("KeyA")) {
            const camera_add = vec_rotate(
                { x: -speed, y: 0 },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }
        if (this.isKeyDown("KeyD")) {
            const camera_add = vec_rotate(
                { x: speed, y: 0 },
                playerState.angle
            );
            playerState.position = vec_add(playerState.position, camera_add);
        }

        if (this.isKeyDown("Space")) {
            playerState.height += speed;
        }
        if (this.isKeyDown("ShiftLeft")) {
            playerState.height -= speed;
        }

        if (this.isKeyDown("ArrowLeft")) {
            playerState.angle -= speed / 3;
        }
        if (this.isKeyDown("ArrowRight")) {
            playerState.angle += speed / 3;
        }
    }

    private attachWindowHooks() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private onKeyUp = (keyboardEvent: KeyboardEvent) => {
        this.keydown[keyboardEvent.code] = false;
    };

    private onKeyDown = (keyboardEvent: KeyboardEvent) => {
        this.keydown[keyboardEvent.code] = true;
    };

    private isKeyDown(key: string) {
        return this.keydown[key] == true;
    }

    private onGameEvent = (event: GameEvent, source: GameEventSource) => {};
}
