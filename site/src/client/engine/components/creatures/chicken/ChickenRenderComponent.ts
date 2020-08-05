import {
    Sprites,
    SpriteSheets,
    Animations,
} from "../../../../resources/manifests/Types";
import { ProcedureService } from "../../../../services/jobs/ProcedureService";
import { StateEffect } from "../../../effects/StateEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { BaseState, SpriteRenderState } from "../../../state/State";
import { ChickenLogicState, ChickenState } from "./ChickenState";
import { effectFromAnimation } from "../../../effects/AnimationEffect";
import { animation } from "../../../../util/animation/Animations";

type ChickenRenderState = BaseState & ChickenState & SpriteRenderState;

export class ChickenRenderComponent<T extends ChickenRenderState>
    implements EntityComponent<T> {
    public componentType = EntityComponentType.ChickenRenderComponent;

    private chickenStateBehaviour: StateEffect;

    public init(entity: Entity<ChickenRenderState>) {
        const { logicState } = entity.getState();
        const resourceManager = entity.getServiceLocator().getResourceManager();
        const spritesheet =
            resourceManager.manifest.spritesheets[SpriteSheets.SPRITE];

        const walkingAnimation = animation((x: number) => {
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        Animations.CHICKEN_WALKING,
                        x
                    ).textureCoordinate,
                },
                false
            );
        }).speed(1000).withOffset(Math.random()).looping();

        const sittingAnimation = animation((x: number) => {
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        Animations.CHICKEN_SITTING,
                        x
                    ).textureCoordinate,
                },
                false
            );
        }).speed(1000).withOffset(Math.random()).looping();

        const jumpingAnimation = animation((x: number) => {
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        Animations.CHICKEN_JUMPING,
                        x
                    ).textureCoordinate,
                },
                false
            );
        }).speed(1000).withOffset(Math.random()).looping();

        const eatingAnimation = animation((x: number) => {
            entity.setState(
                {
                    textureCoordinate: spritesheet.getAnimationInterp(
                        Animations.CHICKEN_EATING,
                        x
                    ).textureCoordinate,
                },
                false
            );
        }).speed(1000).withOffset(Math.random()).looping();

        this.chickenStateBehaviour = new StateEffect(
            {
                [ChickenLogicState.STANDING_IDLE]: this.chickenBlinksRandomly(
                    entity,
                    Sprites.CHICKEN_STANDING_EYE_OPEN,
                    Sprites.CHICKEN_STANDING_EYE_CLOSED
                ),
                [ChickenLogicState.SITTING_IDLE]: this.chickenBlinksRandomly(
                    entity,
                    Sprites.CHICKEN_SITTING_EYE_OPEN,
                    Sprites.CHICKEN_SITTING_EYE_CLOSED
                ),
                [ChickenLogicState.WALKING]: effectFromAnimation(
                    walkingAnimation
                ),
                [ChickenLogicState.SITTING]: effectFromAnimation(
                    sittingAnimation
                ),
                [ChickenLogicState.JUMPING]: effectFromAnimation(
                    jumpingAnimation
                ),
                [ChickenLogicState.EATING]: effectFromAnimation(
                    eatingAnimation
                ),
                [ChickenLogicState.SLEEPING]: {
                    onEnter: () => entity.setState({
                        textureCoordinate: spritesheet.getSprite(Sprites.CHICKEN_SITTING_EYE_CLOSED).textureCoordinate,
                    })
                },
                [ChickenLogicState.HATCHING]: this.chickenBlinksRandomly(
                    entity,
                    Sprites.CHICKEN_SITTING_EYE_OPEN,
                    Sprites.CHICKEN_SITTING_EYE_CLOSED
                ),
            },
            logicState
        );
    }

    public update(entity: Entity<ChickenRenderState>) {
        this.chickenStateBehaviour.update();
    }

    public onCreate(entity: Entity<ChickenRenderState>) {
        this.chickenStateBehaviour.load();
    }

    public onDestroy(entity: Entity<ChickenRenderState>) {
        this.chickenStateBehaviour.unload();
    }

    private chickenBlinksRandomly(
        entity: Entity<ChickenRenderState>,
        eyeOpenSprite: number,
        eyeClosedSprite: number
    ) {
        let timeout: number;
        let open: boolean = true;

        const blink = () => {
            const sprite = open ? eyeOpenSprite : eyeClosedSprite;
            const sheet = entity.getServiceLocator().getResourceManager()
                .manifest.spritesheets[SpriteSheets.SPRITE];
            entity.setState({
                textureCoordinate: sheet.getSprite(sprite).textureCoordinate,
            });
            const timeTillFlip = open
                ? Math.random() * 2000 + 1000
                : Math.random() * 200 + 100;
            ProcedureService.setGameTimeout(() => {
                open = !open;
                blink();
            }, timeTillFlip);
        };

        return {
            onEnter: () => {
                blink();
            },
            onUpdate: () => {},
            onLeave: () => {
                ProcedureService.clearTimeout(timeout);
            },
        };
    }
}
