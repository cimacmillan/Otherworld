import { ServiceLocator } from "../../services/ServiceLocator";
import { Audios } from "../manifests/Audios";
import { UnloadedMap } from "./MapTypes";

export const MapCellar: UnloadedMap = {
    url: "map/prison.tmx",
    metadata: {
        onStart: (serviceLocator: ServiceLocator) => {
            serviceLocator
                .getAudioService()
                .playSong(
                    serviceLocator.getResourceManager().manifest.audio[
                        Audios.SONG_BIT_STEP
                    ],
                    0.1
                );
        },
    },
};
