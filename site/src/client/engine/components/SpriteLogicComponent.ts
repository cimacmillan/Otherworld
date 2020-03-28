import { Sprite, RenderItem } from "../../render/types/RenderInterface";
import { BaseState } from "../State";
import { EntityComponent } from "../EntityComponent";
import { Entity } from "../Entity";
import { GameEvent } from "../events/Event";
import { EntityEventType } from "../events/EntityEvents";
import { SpriteStateType } from "./SpriteRenderComponent";
import { getTextureCoordinate } from "../../util/math";

export class SpriteLogicComponent<
  T extends SpriteStateType
> extends EntityComponent<T> {
  private toRenderRef?: RenderItem;

  public init(entity: Entity<SpriteStateType>): void {}

  public update(entity: Entity<SpriteStateType>): void {}

  public onEvent(entity: Entity<SpriteStateType>, event: GameEvent): void {
    switch (event.type) {
      case EntityEventType.ENTITY_CREATED:
        const xtex = 32 * Math.round(Math.random());
        const ytex = 32 * Math.round(Math.random());
        entity.setState({
          toRender: {
            position: [0, 0],
            size: [1, 1],
            height: 0,
            ...getTextureCoordinate(64, 64, 32, 32, xtex, ytex),
          },
        });
        break;
      case EntityEventType.ENTITY_DELETED:
        entity.setState({
          toRender: undefined,
        });
        break;
    }
  }

  public onObservedEvent(
    entity: Entity<SpriteStateType>,
    event: GameEvent
  ): void {}
}
