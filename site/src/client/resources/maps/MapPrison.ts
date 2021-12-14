import { Backgrounds } from "../../services/render/services/BackgroundRenderService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Audios } from "../manifests/Audios";
import { UnloadedMap } from "./MapTypes";

export const MapPrison: UnloadedMap = {
    url: "map/prison.tmx",
    metadata: {
        onStart: (serviceLocator: ServiceLocator) => {
            // serviceLocator
            //     .getAudioService()
            //     .playSong(
            //         serviceLocator.getResourceManager().manifest.audio[
            //             Audios.SONG_CURIOUS_NOISES
            //         ],
            //         0.1
            //     );
        },
    },
};
