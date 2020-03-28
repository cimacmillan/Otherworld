import { RenderItem, Sprite } from "../../render/types/RenderInterface";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import { BaseState } from "../State";

export interface SpriteState {
  toRender?: Sprite;
}

export type SpriteStateType = BaseState & SpriteState;

export class SpriteRenderComponent<
  T extends SpriteStateType
> extends EntityComponent<T> {
  private toRenderRef?: RenderItem;

  public init(entity: Entity<SpriteStateType>) {
    return {};
  }

  public update(entity: Entity<SpriteStateType>): void {
    const { toRender } = entity.getState();
    if (toRender) {
      this.serviceLocator
        .getRenderService()
        .spriteRenderService.updateItem(this.toRenderRef, toRender);
    }
  }

  public onEvent(entity: Entity<SpriteStateType>, event: GameEvent): void {
    switch (event.type) {
      case EntityEventType.STATE_TRANSITION:
        this.onStateTransition(event.payload.from, event.payload.to);
        break;
    }
  }

  public onObservedEvent(
    entity: Entity<SpriteStateType>,
    event: GameEvent
  ): void {}

  private onStateTransition(from: SpriteState, to: SpriteState) {
    if (!from.toRender && to.toRender) {
      this.toRenderRef = this.serviceLocator
        .getRenderService()
        .spriteRenderService.createItem(to.toRender);
    } else if (from.toRender && !to.toRender) {
      this.serviceLocator
        .getRenderService()
        .spriteRenderService.freeItem(this.toRenderRef);
    }
  }
}
