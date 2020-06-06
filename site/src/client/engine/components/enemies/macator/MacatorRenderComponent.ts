import {
    Animations,
    Sprites,
    SpriteSheets,
} from "../../../../resources/manifests/Types";
import { animation } from "../../../../util/animation/Animations";
import { effectFromAnimation } from "../../../../util/engine/AnimationEffect";
import { joinEffect } from "../../../../util/engine/JoinEffect";
import { StateEffect } from "../../../../util/engine/StateEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import {
    MacatorLogicState,
    MacatorState,
    MacatorType,
} from "../../../state/Macator";
import { BaseState, SpriteRenderState } from "../../../state/State";

type MacatorRenderState = BaseState & MacatorLogicState & SpriteRenderState;

const DEFAULT_HEIGHT = 0.5;
const JUMP_HEIGHT = 0.25;

export class MacatorRenderComponent<T extends MacatorRenderState>
    implements EntityComponent<T> {
    public componentType = EntityComponentType.MacatorRenderComponent;

    private animationStateEffect: StateEffect;

    public init(entity: Entity<MacatorRenderState>): void {
        const { macatorType, macatorState } = entity.getState();
        const resourceManager = entity.getServiceLocator().getResourceManager();
        const spritesheet =
            resourceManager.manifest.spritesheets[SpriteSheets.SPRITE];

        let deadSprite: Sprites;
        let walkingAnimationType: Animations;
        let attackAnimationType: Animations;
        switch (macatorType) {
            case MacatorType.BROWN:
                deadSprite = Sprites.MACATOR_DEAD_BROWN;
                walkingAnimationType = Animations.CRABLET_BROWN;
                attackAnimationType = Animations.CRABLET_BROWN_ATTACK;
                break;
            case MacatorType.GREEN:
                deadSprite = Sprites.MACATOR_DEAD_GREEN;
                walkingAnimationType = Animations.CRABLET_GREEN;
                attackAnimationType = Animations.CRABLET_GREEN_ATTACK;
                break;
            case MacatorType.BLUE:
                deadSprite = Sprites.MACATOR_DEAD_BLUE;
                walkingAnimationType = Animations.CRABLET_BLUE;
                attackAnimationType = Animations.CRABLET_BLUE_ATTACK;
                break;
        }

        const deadTexture = spritesheet.getSprite(deadSprite).textureCoordinate;
        const walkingAnimation = animation((x: number) => {
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        walkingAnimationType,
                        x
                    ).textureCoordinate,
                },
                false
            );
        })
            .speed(400)
            .withOffset(Math.random())
            .looping();

        const attackAnimation = animation((x: number) => {
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        attackAnimationType,
                        x
                    ).textureCoordinate,
                    height:
                        DEFAULT_HEIGHT + Math.sin(x * Math.PI) * JUMP_HEIGHT,
                },
                false
            );
        })
            .speed(400)
            .withOffset(Math.random())
            .looping();

        const damagedTexture = spritesheet.getSprite(Sprites.MACATOR_DAMAGED)
            .textureCoordinate;
        const damagedAnimation = animation((x: number) => {
            entity.setState(
                {
                    textureCoordinate: damagedTexture,
                    spriteWidth: 0.5 + x,
                    spriteHeight: 0.5 + x,
                },
                false
            );
        })
            .tween((x: number) => Math.sin(x * Math.PI))
            .speed(200);

        const resetSizeAndHeight = {
            onLeave: () => {
                entity.setState(
                    {
                        height: DEFAULT_HEIGHT,
                        spriteWidth: 1,
                        spriteHeight: 1,
                    },
                    false
                );
            },
        };

        this.animationStateEffect = new StateEffect(
            {
                [MacatorState.WALKING]: effectFromAnimation(walkingAnimation),
                [MacatorState.ATTACKING]: joinEffect(
                    effectFromAnimation(attackAnimation),
                    resetSizeAndHeight
                ),
                [MacatorState.DAMAGED]: joinEffect(
                    effectFromAnimation(damagedAnimation),
                    resetSizeAndHeight
                ),
                [MacatorState.DEAD]: {
                    onEnter: () => {
                        entity.setState(
                            {
                                textureCoordinate: deadTexture,
                            },
                            false
                        );
                    },
                },
            },
            macatorState
        );
    }

    public update(entity: Entity<MacatorRenderState>): void {
        this.animationStateEffect.update();
    }

    public onCreate(entity: Entity<MacatorRenderState>): void {
        this.animationStateEffect.load();
    }

    public onDestroy(entity: Entity<MacatorRenderState>): void {
        this.animationStateEffect.unload();
    }

    public onStateTransition(
        entity: Entity<MacatorRenderState>,
        from: MacatorRenderState,
        to: MacatorRenderState
    ) {
        if (from.macatorState !== to.macatorState) {
            this.animationStateEffect.setState(to.macatorState);
        }
    }
}
