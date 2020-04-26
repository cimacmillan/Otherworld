import { BaseState, LogicState } from "../State";
import { SpriteStateType } from "./SpriteRenderComponent";
import { EntityComponent } from "../EntityComponent";
import { Entity } from "../Entity";
import { GameEvent } from "../events/Event";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { CompositeAnimation } from "../../util/animation/CompositeAnimation";

interface AnimationStateMap {
    [key: string]: GameAnimation | CompositeAnimation
}

interface AnimationState {
    animationState: {
        map: AnimationStateMap
    }
}

export type AnimationStateType = BaseState & AnimationState & LogicState;


export class AnimationStateComponent<
    T extends AnimationStateType
> extends EntityComponent<T> {

    public init(entity: Entity<AnimationStateType>) {
        return {};
    }

    public update(entity: Entity<AnimationStateType>): void {
        const { map } = entity.getState().animationState;
        for (let key in map) {
            map[key].tick();
        }
    }

    public onEvent(entity: Entity<AnimationStateType>, event: GameEvent): void {

    }

    public onObservedEvent(
        entity: Entity<AnimationStateType>,
        event: GameEvent
    ): void {}

    public onCreate(entity: Entity<AnimationStateType>) {
        const { map } = entity.getState().animationState;
        map[entity.getState().logicState].start();
    }

    public onDestroy(entity: Entity<AnimationStateType>) {
        this.stopAll(entity.getState().animationState.map);
    }

    public onStateTransition(
        entity: Entity<AnimationStateType>,
        from: AnimationStateType,
        to: AnimationStateType
    ) {
        this.stopAll(from.animationState.map);
        to.animationState.map[to.logicState].start();
    }

    private stopAll(map: AnimationStateMap) {
        for (let key in map) {
            map[key].stop();
        }
    }

}
