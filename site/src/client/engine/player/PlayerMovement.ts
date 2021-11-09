import { Audios } from "../../resources/manifests/Audios";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Vector2D } from "../../types";
import { animation } from "../../util/animation/Animations";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { vec } from "../../util/math";
import { ActionDelay } from "../../util/time/ActionDelay";
import { fpsNorm } from "../../util/time/GlobalFPSController";
import { ActionSwitch } from "../../util/time/Switch";
import { TurnDirection, WalkDirection } from "../commands/PlayerCommands";
import { PhysicsStateType } from "../components/core/PhysicsComponent";
import { PlayerBonuses } from "./Player";

const WALK_SPEED = 0.02;
const TURN_SPEED = 0.15;
const HEAD_BOB_NERF = 1;

export class PlayerMovement {
    private walking: ActionSwitch;
    private accumulatedWalk: Vector2D = { x: 0, y: 0 };
    private accumulatedAngle: number = 0;
    private headbob: GameAnimation;
    private headbobOffset = 0;
    private walkNoiseDelay: ActionDelay;

    public constructor(
        private serviceLocator: ServiceLocator,
        private getSurface: () => PhysicsStateType,
        private setVelocity: (vec: Vector2D) => void,
        private setAngle: (angle: number) => void,
        private getBonuses: () => PlayerBonuses
    ) {
        this.walkNoiseDelay = new ActionDelay(400);
        this.headbob = animation((x: number) => {
            const { velocity } = this.getSurface();
            const speed = vec.vec_distance(velocity);
            this.headbobOffset =
                Math.abs(Math.sin(x * Math.PI)) * speed * HEAD_BOB_NERF;
        })
            .speed(400)
            .looping()
            .start();

        this.walking = new ActionSwitch();

        // this.walking = new ActionSwitch(
        //     () => this.headbob.start(),
        //     () => this.headbob.stop()
        // );
    }

    public update() {
        this.walking.update();
        this.headbob.tick();

        const { velocity, angle } = this.getSurface();

        this.setVelocity(vec.vec_add(velocity, this.accumulatedWalk));

        this.setAngle(angle + this.accumulatedAngle);

        this.accumulatedAngle = 0;
        this.accumulatedWalk = { x: 0, y: 0 };

        if (
            this.walking.isBeingPerformed() &&
            this.walkNoiseDelay.canAction()
        ) {
            this.walkNoiseDelay.onAction();
            this.serviceLocator
                .getAudioService()
                .play(
                    this.serviceLocator.getResourceManager().manifest.audio[
                        Audios.FOOTSTEP
                    ],
                    0.1
                );
        }
    }

    public walk(direction: WalkDirection) {
        this.walking.onPerformed();
        const walkSpeed = this.getBonuses().moveSpeed ? WALK_SPEED * 2 : WALK_SPEED;
        const speed = fpsNorm(walkSpeed);
        let camera_add = { x: 0, y: 0 };
        const { angle } = this.getSurface();
        switch (direction) {
            case WalkDirection.FORWARD:
                camera_add = vec.vec_rotate({ x: 0, y: -speed }, angle);
                break;
            case WalkDirection.BACK:
                camera_add = vec.vec_rotate({ x: 0, y: speed }, angle);
                break;
            case WalkDirection.LEFT:
                camera_add = vec.vec_rotate({ x: -speed, y: 0 }, angle);
                break;
            case WalkDirection.RIGHT:
                camera_add = vec.vec_rotate({ x: speed, y: 0 }, angle);
                break;
        }
        this.accumulatedWalk = vec.vec_add(this.accumulatedWalk, camera_add);
    }

    public turn(direction: TurnDirection) {
        const speed = fpsNorm(TURN_SPEED);
        switch (direction) {
            case TurnDirection.ANTICLOCKWISE:
                this.accumulatedAngle = this.accumulatedAngle - speed / 3;
                break;
            case TurnDirection.CLOCKWISE:
                this.accumulatedAngle = this.accumulatedAngle + speed / 3;
                break;
        }
    }

    public getHeadbobOffset(): number {
        return this.headbobOffset;
    }

    public destroy() {}
}
