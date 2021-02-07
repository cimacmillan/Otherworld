import { ServiceLocator } from "../../../services/ServiceLocator";
import { Audios } from "../../manifests/Audios";
import { GameItem } from "../../manifests/Items";
import { Maps } from "../../manifests/Maps";
import { MapLayerConverterType } from "../MapLayerConverters";
import { MapMetadataBuilder } from "../MapMetadataBuilder";
import { MapSchema } from "../MapShema";

const mapMetadata = new MapMetadataBuilder();

mapMetadata.at(31, 29).withHorizontal(true);

mapMetadata
    .at(31, 27)
    .withLockConfiguration({
        width: 2,
        height: 2,
        shouldReset: false,
    })
    .withHorizontal(true);

mapMetadata
    .at(33, 28)
    .withHorizontal(false)
    .withLockKey(GameItem.GOLD_KEY)
    .withLockConfiguration({
        width: 5,
        height: 5,
        shouldReset: true,
    });

mapMetadata.at(31, 25).withItem(GameItem.GOLD_KEY);

mapMetadata.at(40, 28).withDestination({
    mapId: Maps.CELLAR,
    destination: {
        x: 3,
        y: 3,
        angle: 0,
    },
});

export const MapPrison: MapSchema = {
    layers: [
        {
            imageUrl: "map/prison/block/block_walls.png",
            mapLayerConverter: MapLayerConverterType.DEFAULT,
            mapMetadata: mapMetadata.get(),
        },
        {
            imageUrl: "map/prison/block/block_floors.png",
            mapLayerConverter: MapLayerConverterType.DEFAULT,
            mapMetadata: [],
        },
    ],
    onStart: (serviceLocator: ServiceLocator) => {
        serviceLocator
            .getAudioService()
            .playSong(
                serviceLocator.getResourceManager().manifest.audio[
                    Audios.SONG_CURIOUS_NOISES
                ],
                0.1
            );
    },
};
