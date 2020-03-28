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
  private seed: number;
  private yVel: number = 0;

  public init(entity: Entity<SpriteStateType>) {
    this.seed = Math.random();
    return {};
  }

  public update(entity: Entity<SpriteStateType>): void {
    const sprite = entity.getState().toRender;
    if (!sprite) {
      return;
    }

    this.yVel -= 0.01;
    sprite.height = sprite.height + this.yVel;

    if (sprite.height < 0) {
      this.yVel = Math.abs(this.yVel);
      sprite.height = 0;

      if (this.yVel > 0.01) {
        this.serviceLocator
          .getAudioService()
          .play3D(
            this.serviceLocator.getResourceManager().boing,
            sprite.position,
            this.yVel
          );
      }
    }

    this.yVel *= 0.99;
  }

  public onEvent(entity: Entity<SpriteStateType>, event: GameEvent): void {
    const spread = 10;

    switch (event.type) {
      case EntityEventType.ENTITY_CREATED:
        const xtex = 32 * Math.round(Math.random());
        const ytex = 32 * Math.round(Math.random());
        entity.setState(
          {
            toRender: {
              position: [
                Math.random() * spread - spread / 2,
                -Math.random() * spread,
              ],
              size: [1, 1],
              height: 10 * this.seed,
              ...getTextureCoordinate(64, 64, 32, 32, xtex, ytex),
            },
          },
          true
        );
        break;
      case EntityEventType.ENTITY_DELETED:
        entity.setState(
          {
            toRender: undefined,
          },
          true
        );
        break;
    }
  }

  public onObservedEvent(
    entity: Entity<SpriteStateType>,
    event: GameEvent
  ): void {}
}
