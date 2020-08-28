import {
    Animations,
    SpriteSheets,
} from "../../../../resources/manifests/Types";
import {
    ProcedureID,
    ProcedureService,
} from "../../../../services/jobs/ProcedureService";
import { createMacator } from "../../../../services/scripting/factory/EnemyFactory";
import { animation, sin } from "../../../../util/animation/Animations";
import { GameAnimation } from "../../../../util/animation/GameAnimation";
import { effectFromAnimation } from "../../../effects/AnimationEffect";
import { joinEffect } from "../../../effects/JoinEffect";
import { StateEffect } from "../../../effects/StateEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { EnemyEventType } from "../../../events/EnemyEvents";
import { GameEvent } from "../../../events/Event";
import { EggLogicState, EggState } from "../../../state/Macator";
import { BaseState, LogicState } from "../../../state/State";
import { PhysicsStateType } from "../../physics/PhysicsComponent";
import { SpriteStateType } from "../../rendering/SpriteRenderComponent";

export type EggStateType = BaseState &
    SpriteStateType &
    LogicState &
    PhysicsStateType &
    EggLogicState;

export class EggLogicComponent<T extends EggStateType>
    implements EntityComponent<T> {
    public componentType = EntityComponentType.EggLogicComponent;

    private hatchingAnimation: GameAnimation;
    private stateEffects: StateEffect;
    // private hatchingID: number;

    public init(entity: Entity<EggStateType>) {
        const spritesheet = entity.getServiceLocator().getResourceManager()
            .manifest.spritesheets[SpriteSheets.SPRITE];
        const idleAnimation = animation((x) =>
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        Animations.EGG_CHARGE,
                        x
                    ).textureCoordinate,
                },
                false
            )
        )
            .speed(2000)
            .looping();

        this.hatchingAnimation = animation((x) =>
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        Animations.EGG_CHARGE,
                        x
                    ).textureCoordinate,
                },
                false
            )
        )
            .speed(400)
            .tween(sin)
            .looping();

        this.stateEffects = new StateEffect(
            {
                [EggState.IDLE]: joinEffect(
                    effectFromAnimation(idleAnimation),
                    this.idleEffect(entity)
                ),
                [EggState.HATCHING]: joinEffect(
                    effectFromAnimation(this.hatchingAnimation),
                    this.hatchingEffect(entity)
                ),
            },
            entity.getState().logicState
        );
    }

    public update(entity: Entity<EggStateType>): void {
        this.stateEffects.update();
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
        }
    }

    public onCreate(entity: Entity<EggStateType>) {
        const { logicState } = entity.getState();
        this.stateEffects.load();
    }

    public onDestroy(entity: Entity<EggStateType>) {
        this.stateEffects.unload();
    }

    public onStateTransition(
        entity: Entity<EggStateType>,
        from: EggStateType,
        to: EggStateType
    ) {
        if (from.logicState !== to.logicState) {
            this.stateEffects.setState(to.logicState);
        }
    }

    private idleEffect(entity: Entity<EggStateType>) {
        let timeout: ProcedureID | undefined;
        return {
            onEnter: () => {
                const { targetCount } = entity.getState();
                if (targetCount === 0) {
                    timeout = ProcedureService.setGameTimeout(() => {
                        this.increaseDifficulty(entity);
                        entity.setState({
                            logicState: EggState.HATCHING,
                        });
                    }, 5000);
                }
            },
            onUpdate: () => {
                const { currentLiving, targetCount } = entity.getState();
                if (currentLiving <= 0 && targetCount !== 0) {
                    this.increaseDifficulty(entity);
                    entity.setState({
                        logicState: EggState.HATCHING,
                    });
                }
            },
            onLeave: () => {
                if (timeout) {
                    ProcedureService.clearTimeout(timeout);
                }
            },
        };
    }

    private hatchingEffect(entity: Entity<EggStateType>) {
        let timeout: ProcedureID | undefined;
        return {
            onEnter: () => {
                const { targetCount } = entity.getState();
                timeout = ProcedureService.setGameInterval(() => {
                    this.hatch(entity);
                    const { currentLiving } = entity.getState();
                    if (currentLiving >= targetCount) {
                        ProcedureService.clearInterval(timeout);
                        entity.setState({
                            logicState: EggState.IDLE,
                        });
                    }
                }, 100 / targetCount + 300);
            },
            onUpdate: () => {},
            onLeave: () => {
                ProcedureService.clearInterval(timeout);
            },
        };
    }

    private increaseDifficulty(entity: Entity<EggStateType>) {
        const targetCount = entity.getState().targetCount * 2 + 1;
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
        entity.getServiceLocator().getWorld().addEntity(macator);
    }
}
