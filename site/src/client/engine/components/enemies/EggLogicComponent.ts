import { Animations, SpriteSheets } from "../../../resources/manifests/Types";
import { createMacator } from "../../../services/scripting/factory/EntityFactory";
import { animation, sin } from "../../../util/animation/Animations";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { effectFromAnimation } from "../../../util/engine/AnimationEffect";
import { StateEffect } from "../../../util/engine/StateEffect";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { EnemyEventType } from "../../events/EnemyEvents";
import { GameEvent } from "../../events/Event";
import { EggLogicState, EggState } from "../../state/Macator";
import { BaseState, LogicState } from "../../state/State";
import { PhysicsStateType } from "../physics/PhysicsComponent";
import { SpriteStateType } from "../rendering/SpriteRenderComponent";

export type EggStateType = BaseState &
    SpriteStateType &
    LogicState &
    PhysicsStateType &
    EggLogicState;

const SIZE = 3;

export class EggLogicComponent<T extends EggStateType>
    implements EntityComponent<T> {
    private hatchingAnimation: GameAnimation;
    private animations: StateEffect;

    public init(entity: Entity<EggStateType>) {
        const spritesheet = entity.getServiceLocator().getResourceManager()
            .manifest.spritesheets[SpriteSheets.SPRITE];
        const idleAnimation = animation((x) => {
            const frame = spritesheet.getAnimationInterp(
                Animations.EGG_CHARGE,
                x
            );
            entity.getState().spriteState.sprite.texture =
                frame.textureCoordinate;
        })
            .speed(2000)
            .looping();

        this.hatchingAnimation = animation((x) => {
            const frame = spritesheet.getAnimationInterp(
                Animations.EGG_CHARGE,
                x
            );
            entity.getState().spriteState.sprite.texture =
                frame.textureCoordinate;
        })
            .speed(400)
            .tween(sin)
            .looping()
            .whenDone(() => this.hatch(entity));

        setTimeout(() => {
            this.hatchingAnimation.withOffset(
                idleAnimation.getCurrentPosition()
            );
            entity.setState({
                logicState: EggState.HATCHING,
            });
        }, 5000);

        this.animations = new StateEffect(
            {
                [EggState.IDLE]: effectFromAnimation(idleAnimation),
                [EggState.HATCHING]: effectFromAnimation(
                    this.hatchingAnimation
                ),
            },
            EggState.IDLE
        );
    }

    public update(entity: Entity<EggStateType>): void {
        const state = entity.getState();
        state.spriteState.sprite.position = [
            state.position.x,
            state.position.y,
        ];

        this.animations.update();
    }

    public onObservedEvent(
        entity: Entity<EggStateType>,
        event: GameEvent
    ): void {
        if (event.type === EnemyEventType.ENEMY_KILLED) {
            entity.setState(
                {
                    currentLiving: entity.getState().currentLiving - 1,
                },
                false
            );

            if (entity.getState().currentLiving <= 0) {
                this.increaseDifficulty(entity);
            }
        }
    }

    public onCreate(entity: Entity<EggStateType>) {
        this.animations.load();
    }

    public onStateTransition(
        entity: Entity<EggStateType>,
        from: EggStateType,
        to: EggStateType
    ) {
        if (from.logicState !== to.logicState) {
            this.animations.setState(to.logicState);
        }
    }

    private increaseDifficulty(entity: Entity<EggStateType>) {
        const targetCount = entity.getState().targetCount * 2;
        entity.setState({
            targetCount,
            logicState: EggState.HATCHING,
        });
        this.hatchingAnimation.speed(100 / targetCount + 300);
    }

    private hatch(entity: Entity<EggStateType>) {
        const { currentLiving, targetCount, position } = entity.getState();
        const newCount = currentLiving + 1;
        entity.setState(
            {
                currentLiving: newCount,
            },
            false
        );

        if (newCount >= targetCount) {
            entity.setState({
                logicState: EggState.IDLE,
            });
        }

        const macator = createMacator(
            entity.getServiceLocator(),
            position.x,
            position.y
        );
        macator.attachListener(entity);
        entity.getServiceLocator().getWorld().addEntity(macator);
    }
}
