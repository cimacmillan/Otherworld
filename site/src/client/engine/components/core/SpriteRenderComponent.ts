import {
    RenderItem,
    Sprite,
    SpriteShadeOverride,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import {
    DEFAULT_SPRITE_RENDER_STATE,
    SpriteRenderState,
} from "../../state/State";

const DEFAULT_SHADE_OVERRIDE: SpriteShadeOverride = {
    r: 0,
    g: 0,
    b: 0,
    intensity: 0,
};

export class SpriteRenderComponent
    implements EntityComponent<SpriteRenderState> {
    private toRenderRef?: RenderItem;
    private sprite: Sprite;

    public getInitialState = (): SpriteRenderState =>
        DEFAULT_SPRITE_RENDER_STATE;

    public update(entity: Entity<SpriteRenderState>): void {
        const state = entity.getState();
        this.sprite = this.getSpriteFromState(state);

        entity
            .getServiceLocator()
            .getRenderService()
            .spriteRenderService.updateItem(this.toRenderRef, this.sprite);
    }

    public onCreate(entity: Entity<SpriteRenderState>): void {
        this.toRenderRef = entity
            .getServiceLocator()
            .getRenderService()
            .spriteRenderService.createItem(
                this.getSpriteFromState(entity.getState())
            );
    }

    public onDestroy(entity: Entity<SpriteRenderState>) {
        if (this.toRenderRef) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }

    private getSpriteFromState(state: SpriteRenderState): Sprite {
        return {
            position: [state.position.x, state.position.y],
            size: [state.spriteWidth, state.spriteHeight],
            height: state.height + state.spriteHeight / 2,
            texture: state.textureCoordinate,
            shade: state.shade || DEFAULT_SHADE_OVERRIDE,
        };
    }
}
