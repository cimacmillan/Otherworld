import {
    Sprites,
    SpriteSheets,
} from "../../../../resources/manifests/Types";
import { ProcedureService } from "../../../../services/jobs/ProcedureService";
import { effectFromAnimation } from "../../../effects/AnimationEffect";
import { StateEffect } from "../../../effects/StateEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { BaseState, SpriteRenderState } from "../../../state/State";
import { getChickenAnimations } from "./animations";
import {
    ChickenLogicState,
    ChickenState,
    ChickenStateType,
} from "./ChickenState";

type ChickenRenderState = BaseState & ChickenState & SpriteRenderState;

export class ChickenRenderComponent<T extends ChickenStateType>
    implements EntityComponent<T> {
    public componentType = EntityComponentType.ChickenRenderComponent;

    private chickenStateBehaviour: StateEffect;

    public init(entity: Entity<ChickenStateType>) {
        const { logicState } = entity.getState();
        const spritesheet = entity.getServiceLocator().getResourceManager()
            .manifest.spritesheets[SpriteSheets.SPRITE];

        const {
            walkingAnimation,
            sittingAnimation,
            jumpingAnimation,
            eatingAnimation,
        } = getChickenAnimations(entity);

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
                    onEnter: () =>
                        entity.setState({
                            textureCoordinate: spritesheet.getSprite(
                                Sprites.CHICKEN_SITTING_EYE_CLOSED
                            ).textureCoordinate,
                        }),
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

    public update(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.update();
    }

    public onCreate(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.load();
    }

    public onDestroy(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.unload();
    }

    public onStateTransition(
        entity: Entity<ChickenStateType>,
        from: ChickenStateType,
        to: ChickenStateType
    ) {
        this.chickenStateBehaviour.setState(to.logicState);
    }

    private chickenBlinksRandomly(
        entity: Entity<ChickenStateType>,
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
            ProcedureService.clearTimeout(timeout);
            timeout = ProcedureService.setGameTimeout(() => {
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
