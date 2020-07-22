import {
    Sprites,
    SpriteSheets,
} from "../../../../resources/manifests/Types";
import { ProcedureService } from "../../../../services/jobs/ProcedureService";
import { StateEffect } from "../../../effects/StateEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { BaseState, SpriteRenderState } from "../../../state/State";
import { ChickenLogicState, ChickenState } from "./ChickenState";

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
