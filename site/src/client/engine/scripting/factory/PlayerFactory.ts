import { ServiceLocator } from "../../../services/ServiceLocator";
import { Player } from "../../player/Player";

export function createPlayer(serviceLocator: ServiceLocator) {
    return new Player(serviceLocator);
}
