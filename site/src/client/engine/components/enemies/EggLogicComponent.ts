import { BaseState, HealthState, SurfacePositionState, LogicState } from "../../State";
import { SpriteStateType } from "../SpriteRenderComponent";
import { InteractionStateType } from "../InteractionComponent";
import { EntityComponent } from "../../EntityComponent";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { TextureCoordinate } from "../../../services/resources/SpriteSheet";
import { ActionDelay } from "../../../util/time/ActionDelay";
import { Entity } from "../../Entity";
import { vec_normalize, vec_sub, vec_add, vec_mult_scalar, vec_distance } from "../../../util/math";
import { InteractionEventType } from "../../events/InteractionEvents";
import { GameEvent } from "../../events/Event";
import { Animations, SpriteSheets, Sprites, Audios } from "../../../services/resources/manifests/Types";
import { animation, sin } from "../../../util/animation/Animations";
import { InteractionType } from "../../../services/interaction/InteractionType";
import { GameEventSource } from "../../../services/EventRouter";
import { EnemyEventType } from "../../events/EnemyEvents";
import { AnimationStateComponent, AnimationStateType } from "../AnimationStateComponent";
import { createMacator } from "../../../services/scripting/factory/EntityFactory";
import { PhysicsStateType } from "../PhysicsComponent";

enum EggState {
    IDLE = "IDLE",
    HATCHING = "HATCHING"
}

interface EggLogicState {
    targetCount: number,
    currentLiving: number
}

export type EggStateType = BaseState &
    SpriteStateType &
    AnimationStateType &
    LogicState &
    PhysicsStateType &
    EggLogicState 
    ;

const SIZE = 3;

export class EggLogicComponent<
    T extends EggStateType
> extends EntityComponent<T> {

    public init(entity: Entity<EggStateType>): Partial<EggStateType> {
        const initialState = EggState.IDLE;

        const spritesheet = entity.getServiceLocator().getResourceManager().manifest.spritesheets[SpriteSheets.SPRITE];
        const idleAnimation = animation(x => {
            const frame = spritesheet.getAnimationInterp(Animations.EGG_CHARGE, x);
            entity.getState().spriteState.sprite.texture = frame.textureCoordinate;
        }).speed(2000).looping();

        const hatchingAnimation = animation(x => {
            const frame = spritesheet.getAnimationInterp(Animations.EGG_CHARGE, x);
            entity.getState().spriteState.sprite.texture = frame.textureCoordinate;
        }).speed(400).tween(sin).looping().whenDone(() => this.hatch(entity));

        setTimeout(() => {
            hatchingAnimation.withOffset(idleAnimation.getCurrentPosition());
            this.setLogicState(entity, EggState.HATCHING);
        }, 5000);

        return {
            logicState: initialState,
            animationState: {
                map: {
                    [EggState.IDLE]: idleAnimation,
                    [EggState.HATCHING]: hatchingAnimation
                }
            },
            targetCount: 1,
            currentLiving: 0,
            velocity: {x: 0, y: 0},
            friction: 0.5,
            mass: 100,
            elastic: 0,
            radius: 1
        };
    }

    public update(entity: Entity<EggStateType>): void {
        const state = entity.getState();
        state.spriteState.sprite.position = [
            state.position.x,
            state.position.y
        ];
    }

    public onEvent(entity: Entity<EggStateType>, event: GameEvent): void {

    }

    public onObservedEvent(
        entity: Entity<EggStateType>,
        event: GameEvent
    ): void {

        console.log("Egg observed ", event);

        if (event.type === EnemyEventType.ENEMY_KILLED) {
            entity.setState({
                currentLiving: entity.getState().currentLiving - 1
            }, false);

            if (entity.getState().currentLiving <= 0) {
                this.increaseDifficulty(entity);
            } 
        }

    }

    public onCreate(entity: Entity<EggStateType>) {
        const spritesheet = entity.getServiceLocator().getResourceManager().manifest.spritesheets[SpriteSheets.SPRITE];
        const firstFrame = spritesheet.getAnimationFrame(Animations.EGG_CHARGE, 0);

        entity.setState({
            spriteState: {
                sprite: {
                    position: [0, 0],
                    size: [SIZE, SIZE],
                    height: SIZE / 2,
                    texture: firstFrame.textureCoordinate
                }
            },
            position: {x: 0, y: 0},
            collides: true,
        });
    }

    public onDestroy(entity: Entity<EggStateType>) {}

    public onStateTransition(
        entity: Entity<EggStateType>,
        from: EggStateType,
        to: EggStateType
    ) {

    }

    private setLogicState(entity: Entity<EggStateType>, state: EggState) {
        entity.setState({
            logicState: state
        })
    }

    private increaseDifficulty(entity: Entity<EggStateType>) {
        entity.setState({
            targetCount: entity.getState().targetCount * 2,
            logicState: EggState.HATCHING
        })

    }

    private hatch(entity: Entity<EggStateType>) {
        const { currentLiving, targetCount} = entity.getState();
        const newCount = currentLiving + 1;
        entity.setState({
            currentLiving: newCount
        }, false);

        if (newCount >= targetCount) {
            this.setLogicState(entity, EggState.IDLE);
        }

        const macator = createMacator(entity.getServiceLocator());
        macator.attachListener(entity);
        entity.getServiceLocator().getWorld().addEntity(macator);
    }

}
