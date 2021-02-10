import { ServiceLocator } from "../../../services/ServiceLocator";
import { Audios } from "../../manifests/Audios";
import { Maps } from "../../manifests/Maps";
import { MapLayerConverterType } from "../MapLayerConverters";
import { MapMetadataBuilder } from "../MapMetadataBuilder";
import { MapSchema } from "../MapShema";

const mapMetadata = new MapMetadataBuilder();

mapMetadata.at(1, 1).withDestination({
    mapId: Maps.PRISON,
    destination: { x: 39, y: 29, angle: 0 },
});

export const MapCellar: MapSchema = {
    layers: [
        {
            imageUrl: "map/cellar/cellar/cellar_walls.png",
            mapLayerConverter: MapLayerConverterType.DEFAULT,
            mapMetadata: mapMetadata.get(),
        },
    ],
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
};
