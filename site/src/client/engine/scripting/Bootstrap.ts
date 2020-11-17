import { ServiceLocator } from "../../services/ServiceLocator";
import { Entity } from "../Entity";

import { Maps, Sprites } from "../../resources/manifests/DefaultManifest";
import { loadMap } from "../../resources/maps/MapLoader";
import { createPlayer, PlayerState } from "./factory/PlayerFactory";
import { createStaticFloor } from "./factory/SceneryFactory";

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

    // world.addEntity(createEgg(serviceLocator));

    // for (let i = 0; i < 30; i++) {
    //     const spread = 5;
    //     const offsetX = -10;
    //     const offsetY = -10;
    //     const x = (Math.random() - 0.5) * spread + offsetX;
    //     const y = (Math.random() - 0.5) * spread + offsetY;
    //     world.addEntity(createChicken(serviceLocator, x, y));
    // }

    // const addChest = (x: number, y: number) => {
    //     world.addEntity(
    //         createStaticSprite(
    //             serviceLocator,
    //             Sprites.CHEST,
    //             {
    //                 x,
    //                 y,
    //             },
    //             0.5,
    //             1,
    //             1
    //         )
    //     );
    // };

    // world.addEntity(createMerchant(serviceLocator, 0, -5));
    // addChest(0.5, -5);
    // addChest(0, -5.5);
    // addChest(-0.5, -5);

    world.addEntity(
        createStaticFloor(
            serviceLocator,
            Sprites.FLOOR,
            0,
            { x: -100, y: -100 },
            { x: 100, y: 100 }
        )
    );

    world.addEntity(
        createStaticFloor(
            serviceLocator,
            Sprites.FLOOR,
            1,
            { x: -100, y: -100 },
            { x: 100, y: 100 }
        )
    );

    // world.addEntity(
    //     createSlime(serviceLocator, getSlimeState(serviceLocator, 0, -5))
    // );

    loadMap(
        serviceLocator,
        serviceLocator.getResourceManager().manifest.maps[Maps.PRISON]
    );

    // loadMap(
    //     serviceLocator,
    //     serviceLocator.getResourceManager().manifest.maps[MAPS.DEFAULT]
    // );

    // loadMap(
    //     serviceLocator,
    //     CaveGenerator(BOOTSTRAP_SEED)
    // );

    return {
        player,
    };
}
