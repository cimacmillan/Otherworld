import { Entity } from "../../engine/Entity";
import { MAPS } from "../../resources/manifests/Types";
import { loadMap } from "../../resources/MapLoader";
import { ServiceLocator } from "../ServiceLocator";
import { createChicken } from "./factory/EnemyFactory";
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

    for (let i = 0; i < 40; i++) {
        const spread = 5;
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread;
        world.addEntity(createChicken(serviceLocator, x, y));
    }

    loadMap(
        serviceLocator,
        serviceLocator.getResourceManager().manifest.maps[MAPS.DEFAULT]
    );

    return {
        player,
    };
}