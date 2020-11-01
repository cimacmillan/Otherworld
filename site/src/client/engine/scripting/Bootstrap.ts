import { ServiceLocator } from "../../services/ServiceLocator";
import { Entity } from "../Entity";

import { Sprites } from "../../resources/manifests/DefaultManifest";
import { ParticleRenderComponent } from "../components/core/ParticleRenderComponent";
import { createSlime, getSlimeState } from "./factory/EnemyFactory";
import { createPlayer, PlayerState } from "./factory/PlayerFactory";
import { createStaticFloor } from "./factory/SceneryFactory";
import { EntitySerial } from "./factory/Serial";

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
        createSlime(serviceLocator, getSlimeState(serviceLocator, 0, -5))
    );

    for (let x = -10; x < 10; x++) {
        for (let y = -100; y < -5; y++) {
            world.addEntity(
                new Entity(
                    EntitySerial.NULL,
                    serviceLocator,
                    {
                        exists: true,
                        position: { x, y },
                        height: Math.random(),
                        yOffset: 0,
                        radius: 1,
                        angle: 0,
                        particleHeight: 0.2,
                        particleWidth: 0.2,
                        r: Math.random(),
                        g: Math.random(),
                        b: Math.random(),
                    },
                    ParticleRenderComponent()
                )
            );
        }
    }

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
