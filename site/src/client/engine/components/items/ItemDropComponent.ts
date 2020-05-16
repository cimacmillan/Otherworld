import { animation } from "../../../util/animation/Animations";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState, SpriteRenderState } from "../../state/State";
import { Item } from "../../../types/TypesItem";
import { PhysicsState } from "../physics/PhysicsComponent";
import { vec } from "../../../util/math";
import { PlayerEventType } from "../../events/PlayerEvents";

const ITEM_SIZE_CHANGE = 0.05;
const ITEM_HEIGHT_CHANGE = 0.2;
const ITEM_ATTRACTION_FORCE = 0.05;
const ITEM_COLLECT_DISTANCE = 0.5;

export interface ItemDropComponentState {
    item: Item
}

type ItemDropComponentStateType = BaseState &
    ItemDropComponentState &
    PhysicsState &
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

    public update(entity: Entity<ItemDropComponentStateType>) {
        this.animation.tick();

        const player = entity.getServiceLocator().getScriptingService().getPlayer();
        const { velocity, position } = entity.getState();
        const playerPosition = player.getState().position;
        const difference = vec.vec_sub(playerPosition, position);
        const distance = vec.vec_distance(difference);
        const force = ITEM_ATTRACTION_FORCE / (distance + 1);
        const attractor = vec.vec_mult_scalar(vec.vec_normalize(difference), force);
        entity.setState({
            velocity: vec.vec_add(velocity, attractor)
        });

        if (distance < ITEM_COLLECT_DISTANCE) {
            entity.emitGlobally({
                type: PlayerEventType.PLAYER_ITEM_DROP_COLLECTED,
                payload: {
                    item: entity.getState().item
                }
            });
            entity.getServiceLocator().getWorld().removeEntity(entity);
        }
    }

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
