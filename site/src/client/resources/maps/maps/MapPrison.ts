import { ServiceLocator } from "../../../services/ServiceLocator";
import { Audios } from "../../manifests/Audios";
import { GameItem } from "../../manifests/Items";
import { Maps } from "../../manifests/Maps";
import { Sprites } from "../../manifests/Sprites";
import { MapLayerConverterType } from "../MapLayerConverters";
import { MapMetadataBuilder } from "../MapMetadataBuilder";
import { MapSchema } from "../MapShema";

const mapMetadata = new MapMetadataBuilder();

mapMetadata.at(29, 29).withHorizontal(true);

mapMetadata
    .at(35, 27)
    .withLockConfiguration({
        width: 2,
        height: 2,
        shouldReset: false,
    })
    .withHorizontal(true);

mapMetadata
    .at(35, 29)
    .withLockConfiguration({
        width: 2,
        height: 2,
        shouldReset: true,
    })
    .withHorizontal(true);

mapMetadata
    .at(29, 27)
    .withHorizontal(true)
    .withLockKey(GameItem.GOLD_KEY)
    .withLockConfiguration({
        width: 5,
        height: 5,
        shouldReset: true,
    });

mapMetadata.at(38, 25).withItem(GameItem.GOLD_KEY);
mapMetadata.at(37, 31).withItem(GameItem.GOLD_RING);

mapMetadata.at(29, 23).withDestination({
    mapId: Maps.CELLAR,
    destination: {
        x: 3,
        y: 3,
        angle: 0,
    },
});

mapMetadata.at(39, 25).withSprite(Sprites.HANGING_MAN);

mapMetadata.at(38, 31).withSprite(Sprites.SKULL).withHeight(0).withSize(0.4);

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
