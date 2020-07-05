import { Entity } from "../../engine/Entity";
import { MAPS } from "../../resources/manifests/Types";
import { loadMap } from "../../resources/MapLoader";
import { ServiceLocator } from "../ServiceLocator";
import { createPlayer, PlayerState } from "./factory/PlayerFactory";

interface BootstrapInfo {
    player: Entity<PlayerState>;
}

export function bootstrap(serviceLocator: ServiceLocator): BootstrapInfo {
    const world = serviceLocator.getWorld();

    const player = createPlayer(serviceLocator);
    world.addEntity(player);

    const camera = player.getState().camera;
    serviceLocator.getAudioService().attachCamera(camera);
    serviceLocator.getRenderService().attachCamera(camera);

    // world.addEntity(createEgg(this.serviceLocator));

    loadMap(
        serviceLocator,
        serviceLocator.getResourceManager().manifest.maps[MAPS.DEFAULT]
    );

    return {
        player,
    };
}
