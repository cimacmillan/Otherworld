import { AnimationStateComponent } from "../../../engine/components/AnimationStateComponent";
import {
    CrabletLogicComponent,
    MacatorStateType,
} from "../../../engine/components/CrabletLogicComponent";
import {
    EggLogicComponent,
    EggStateType,
} from "../../../engine/components/enemies/EggLogicComponent";
import { InteractionComponent } from "../../../engine/components/InteractionComponent";
import { PhysicsComponent } from "../../../engine/components/physics/PhysicsComponent";
import { SpriteRenderComponent } from "../../../engine/components/rendering/SpriteRenderComponent";
import { Entity } from "../../../engine/Entity";
import { ServiceLocator } from "../../ServiceLocator";

export function createMacator(
    serviceLocator: ServiceLocator,
    x: number,
    y: number
) {
    return new Entity<MacatorStateType>(
        serviceLocator,
        new SpriteRenderComponent(),
        new CrabletLogicComponent(x, y),
        new PhysicsComponent(),
        new InteractionComponent()
    );
}

export function createEgg(serviceLocator: ServiceLocator) {
    return new Entity<EggStateType>(
        serviceLocator,
        new SpriteRenderComponent(),
        new AnimationStateComponent(),
        new PhysicsComponent(),
        new EggLogicComponent()
    );
}
