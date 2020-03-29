import { RenderItem, Sprite } from "../../render/types/RenderInterface";
import { getTextureCoordinate } from "../../util/math";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { BallEventType } from "../events/BallEvents";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import { BaseState } from "../State";
import { SpriteStateType } from "./SpriteRenderComponent";

export class SpriteLogicComponent<
  T extends SpriteStateType
> extends EntityComponent<T> {
  private seed: number;
  private yVel: number = 0;
  private bounceVelocity: number = 0;
  private bounceVal: number = 0;

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
    this.bounceVal += this.bounceVelocity;

    sprite.height = sprite.height + this.yVel;

    if (sprite.height - sprite.size[1] / 2 < 0) {
      this.yVel = Math.abs(this.yVel);
      sprite.height = sprite.size[1] / 2;

      if (this.yVel > 0.01) {
        entity.emitGlobally({
          type: BallEventType.BOUNCE,
        });
        entity
          .getServiceLocator()
          .getAudioService()
          .play3D(
            entity.getServiceLocator().getResourceManager().boing,
            sprite.position,
            this.yVel
          );
        this.bounceVelocity = this.yVel;
      }
    }

    const speed = 10;
    const width =
      1 + Math.sin(this.bounceVal * speed) * this.bounceVelocity * 2;
    const height =
      1 +
      Math.sin(this.bounceVal * speed + Math.PI / 2) * this.bounceVelocity * 2;

    sprite.size[0] = width;
    sprite.size[1] = height;

    this.yVel *= 0.995;
    this.bounceVelocity *= 0.9;
  }

  public onEvent(entity: Entity<SpriteStateType>, event: GameEvent): void {
    const spread = 10;

    switch (event.type) {
      case EntityEventType.ENTITY_CREATED:
        const xtex = Math.floor(Math.random() * 4) * 32;
        const ytex = 0;
        entity.setState(
          {
            toRender: {
              position: [
                Math.random() * spread - spread / 2,
                -Math.random() * spread,
              ],
              size: [1, 1],
              height: 10 * this.seed,
              ...getTextureCoordinate(512, 64, 32, 32, xtex, 32),
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
  ): void {
    switch (event.type) {
      case BallEventType.FORCE_BOUNCE:
        this.yVel = Math.random() * 1;
        return;
    }
  }
}
