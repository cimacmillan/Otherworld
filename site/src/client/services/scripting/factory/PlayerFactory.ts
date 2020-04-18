import { PhysicsComponent } from "../../../engine/components/PhysicsComponent";
import {
    PlayerControlComponent,
    PlayerState,
} from "../../../engine/components/player/PlayerControlComponent";
import { Entity } from "../../../engine/Entity";
import { ServiceLocator } from "../../ServiceLocator";

export function createPlayer(serviceLocator: ServiceLocator) {
    return new Entity<PlayerState>(
        serviceLocator,
        new PhysicsComponent(),
        new PlayerControlComponent({ x: 0, y: 2 }, 0)
    );
}
