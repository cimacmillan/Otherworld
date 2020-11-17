import {
    createSlime,
    getSlimeState,
} from "../../../engine/scripting/factory/EnemyFactory";
import {
    createBlock,
} from "../../../engine/scripting/factory/SceneryFactory";
import { Sprites } from "../../manifests/DefaultManifest";
import {
    MapLayerConverter,
    MapLayerGenerationArguments,
} from "../MapLayerConverterType";

export const MapLayerConverterDefault: MapLayerConverter = (
    args: MapLayerGenerationArguments
) => {
    const { serviceLocator, x, y, hex } = args;

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
            return createBlock(serviceLocator, x, y, Sprites.CELL);
    }

    return [];
};
