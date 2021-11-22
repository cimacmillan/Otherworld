import { ServiceLocator } from "../../../services/ServiceLocator";
import { Player } from "../../player/Player";

export function createPlayer(serviceLocator: ServiceLocator, beatenGame: boolean) {
    return new Player(serviceLocator, beatenGame);
}
