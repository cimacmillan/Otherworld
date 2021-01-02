import {
    createDoor,
    createLockedDoor,
} from "../../../engine/scripting/factory/DoorFactory";
import {
    createSlime,
    getSlimeState,
} from "../../../engine/scripting/factory/EnemyFactory";
import { createItemDrop } from "../../../engine/scripting/factory/ItemFactory";
import { createLadder } from "../../../engine/scripting/factory/MapChangeFactory";
import { createBlock } from "../../../engine/scripting/factory/SceneryFactory";
import { GameItem, GameItems } from "../../manifests/Items";
import { Sprites } from "../../manifests/Sprites";
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
            if (metadata.configuration) {
                return createLockedDoor({
                    serviceLocator,
                    x,
                    y,
                    spriteString: Sprites.CELL,
                    configuration: metadata.configuration,
                    horizontal: metadata.horizontal,
                    keyId: metadata.keyId,
                });
            } else {
                return createDoor(
                    serviceLocator,
                    x,
                    y,
                    Sprites.CELL,
                    metadata.horizontal
                );
            }
        case "ffff00":
            return createItemDrop(serviceLocator, {
                item: GameItems[metadata.id as GameItem],
                position: { x: x + 0.5, y: y + 0.5 },
            });
        case "ff00f2":
            return createLadder(serviceLocator, x, y, Sprites.LADDER);
    }

    return [];
};
