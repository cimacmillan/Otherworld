import { ServiceLocator } from "../../services/ServiceLocator";

import { Maps } from "../../resources/manifests/Resources";
import { loadMap } from "../../resources/maps/MapLoader";
import { Player } from "../player/Player";
import { createPlayer } from "./factory/PlayerFactory";

interface BootstrapInfo {
    player: Player;
}

export function bootstrap(serviceLocator: ServiceLocator): BootstrapInfo {
    const player = createPlayer(serviceLocator);

    serviceLocator.getAudioService().attachCamera(() => player.getCamera());
    serviceLocator.getRenderService().attachCamera(() => player.getCamera());

    loadMap(
        serviceLocator,
        serviceLocator.getResourceManager().manifest.maps[Maps.PRISON]
    );

    return {
        player,
    };
}
