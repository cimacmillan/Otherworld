import { Entity } from "../../engine/Entity";
import { MAPS } from "../../resources/manifests/Types";
import { loadMap } from "../../resources/MapLoader";
import { ServiceLocator } from "../ServiceLocator";
import { createChicken, createEgg } from "./factory/EnemyFactory";
import { createPlayer, PlayerState } from "./factory/PlayerFactory";

interface BootstrapInfo {
    player: Entity<PlayerState>;
}

export let BOOTSTRAP_SEED =
    Math.random() * 1998 + Math.random() * 5000 + Math.random() * 3000;

export function bootstrap(serviceLocator: ServiceLocator): BootstrapInfo {
    console.log("SEED: ", BOOTSTRAP_SEED);

    const world = serviceLocator.getWorld();

    const player = createPlayer(serviceLocator);
    world.addEntity(player);

    const camera = player.getState().camera;
    serviceLocator.getAudioService().attachCamera(camera);
    serviceLocator.getRenderService().attachCamera(camera);

    world.addEntity(createEgg(serviceLocator));

    for (let i = 0; i < 30; i++) {
        const spread = 5;
        const offsetX = -10;
        const offsetY = -10;
        const x = (Math.random() - 0.5) * spread + offsetX;
        const y = (Math.random() - 0.5) * spread + offsetY;
        world.addEntity(createChicken(serviceLocator, x, y));
    }

    loadMap(
        serviceLocator,
        serviceLocator.getResourceManager().manifest.maps[MAPS.DEFAULT]
    );

    // loadMap(
    //     serviceLocator,
    //     CaveGenerator(BOOTSTRAP_SEED)
    // );

    return {
        player,
    };
}
