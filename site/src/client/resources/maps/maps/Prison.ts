import { GameItem } from "../../manifests/Items";
import { MapLayerConverterType } from "../MapLayerConverters";
import { MapSchema } from "../MapShema";

export const MapPrison: MapSchema = {
    layers: [
        {
            imageUrl: "map/prison/block/block_walls.png",
            mapLayerConverter: MapLayerConverterType.DEFAULT,
            mapMetadata: [
                {
                    x: 31,
                    y: 29,
                    data: {
                        horizontal: true,
                    },
                },
                {
                    x: 31,
                    y: 27,
                    data: {
                        configuration: {
                            width: 2,
                            height: 2,
                            shouldReset: false,
                        },
                        horizontal: true,
                    },
                },
                {
                    x: 33,
                    y: 28,
                    data: {
                        configuration: {
                            width: 5,
                            height: 5,
                            shouldReset: true,
                        },
                        horizontal: false,
                    },
                },
                {
                    x: 31,
                    y: 25,
                    data: {
                        id: GameItem.GOLD_KEY,
                    },
                },
            ],
        },
    ],
};
