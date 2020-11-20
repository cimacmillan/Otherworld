import {
    createSlime,
    getSlimeState,
} from "../../../engine/scripting/factory/EnemyFactory";
import {
    createBlock,
    createDoor,
} from "../../../engine/scripting/factory/SceneryFactory";
import { Sprites } from "../../manifests/Resources";
import {
    MapLayerConverter,
    MapLayerGenerationArguments,
} from "../MapLayerConverters";

export const MapLayerConverterDefault: MapLayerConverter = (
    args: MapLayerGenerationArguments
) => {
    const { serviceLocator, x, y, hex, metadata } = args;

    switch (hex) {
        case "f6757a":
            return [
                createSlime(
                    serviceLocator,
                    getSlimeState(serviceLocator, x, y)
                ),
            ];
        case "ff0000":
            return createBlock(serviceLocator, x, y, Sprites.WALL);
        case "00ff00":
            return createDoor(
                serviceLocator,
                x,
                y,
                Sprites.CELL,
                metadata.horizontal
            );
    }

    return [];
};