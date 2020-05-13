import { animation } from "../../../util/animation/Animations";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState, SpriteRenderState } from "../../state/State";

const ITEM_SIZE_CHANGE = 0.05;
const ITEM_HEIGHT_CHANGE = 0.2;

export interface ItemDropComponentState {}

type ItemDropComponentStateType = BaseState &
    ItemDropComponentState &
    SpriteRenderState;

export class ItemDropComponent
    implements EntityComponent<ItemDropComponentStateType> {
    private animation: GameAnimation;

    private initialSpriteWidth: number;
    private initialSpriteHeight: number;
    private initialHeight: number;

    public onCreate(entity: Entity<ItemDropComponentStateType>) {
        this.animation = animation((x) => this.onAnimation(x, entity))
            .speed(350)
            .withOffset(Math.random())
            .looping()
            .start();

        const { spriteWidth, spriteHeight, height } = entity.getState();
        this.initialSpriteWidth = spriteWidth;
        this.initialSpriteHeight = spriteHeight;
        this.initialHeight = height;
    }

    public onDestroy(entity: Entity<ItemDropComponentStateType>) {
        this.animation.stop();
    }
    // TODO attract towards player
    public update = () => this.animation.tick();

    private onAnimation(x: number, entity: Entity<ItemDropComponentStateType>) {
        const phase = Math.sin(x * Math.PI);
        const newSpriteWidth =
            this.initialSpriteWidth + phase * ITEM_SIZE_CHANGE;
        const newSpriteHeight =
            this.initialSpriteHeight + phase * ITEM_SIZE_CHANGE;
        const newHeight = this.initialHeight + phase * ITEM_HEIGHT_CHANGE;

        entity.setState(
            {
                spriteWidth: newSpriteWidth,
                spriteHeight: newSpriteHeight,
                height: newHeight,
            },
            false
        );
    }
}
