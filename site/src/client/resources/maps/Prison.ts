import { MapLayerConverterType } from "./MapLayerConverter";
import { MapSchema } from "./MapShema";

export const MapPrison: MapSchema = {
    layers: [
        {
            imageUrl: "map/prison/block.png",
            mapLayerConverter: MapLayerConverterType.DEFAULT,
        },
    ],
};
