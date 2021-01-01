import { ServiceLocator } from "../../services/ServiceLocator";

import { Maps } from "../../resources/manifests/Resources";
import { Sprites } from "../../resources/manifests/Sprites";
import { loadMap } from "../../resources/maps/MapLoader";
import { Player } from "../player/Player";
import { createPlayer } from "./factory/PlayerFactory";
import { createStaticFloor } from "./factory/SceneryFactory";

interface BootstrapInfo {
    player: Player;
}

export function bootstrap(serviceLocator: ServiceLocator): BootstrapInfo {
    const world = serviceLocator.getWorld();

    const player = createPlayer(serviceLocator);

    serviceLocator.getAudioService().attachCamera(() => player.getCamera());
    serviceLocator.getRenderService().attachCamera(() => player.getCamera());

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

    loadMap(
        serviceLocator,
        serviceLocator.getResourceManager().manifest.maps[Maps.PRISON]
    );

    return {
        player,
    };
}
