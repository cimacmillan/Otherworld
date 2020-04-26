import {
    CrabletLogicComponent,
    MacatorStateType,
} from "../../../engine/components/CrabletLogicComponent";
import { InteractionComponent } from "../../../engine/components/InteractionComponent";
import { PhysicsComponent } from "../../../engine/components/PhysicsComponent";
import { SpriteRenderComponent } from "../../../engine/components/SpriteRenderComponent";
import { Entity } from "../../../engine/Entity";
import { ServiceLocator } from "../../ServiceLocator";
import { EggStateType, EggLogicComponent } from "../../../engine/components/enemies/EggLogicComponent";
import { AnimationStateComponent } from "../../../engine/components/AnimationStateComponent";

export function createMacator(serviceLocator: ServiceLocator) {
    return new Entity<MacatorStateType>(
        serviceLocator,
        new SpriteRenderComponent(),
        new CrabletLogicComponent(),
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