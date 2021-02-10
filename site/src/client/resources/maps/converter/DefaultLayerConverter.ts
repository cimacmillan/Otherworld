import {
    createDoorState,
    createLockedDoorState,
} from "../../../engine/scripting/factory/DoorFactory";
import { getSlimeState } from "../../../engine/scripting/factory/EnemyFactory";
import { EntityFactory } from "../../../engine/scripting/factory/EntityFactory";
import { createItemDropState } from "../../../engine/scripting/factory/ItemFactory";
import { createLadderState } from "../../../engine/scripting/factory/MapChangeFactory";
import {
    createBlock,
    createStaticFloorState,
    createStaticSpriteState,
} from "../../../engine/scripting/factory/SceneryFactory";
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
                EntityFactory.ENEMY_SLIME(
                    serviceLocator,
                    getSlimeState(serviceLocator, x, y)
                ),
            ];
        case "ff0000":
            return createBlock(serviceLocator, x, y, Sprites.WALL);
        case "ff8400":
            return createBlock(serviceLocator, x, y, metadata.sprite);
        case "45ffe0":
            return EntityFactory.SCENERY_SPRITE(
                serviceLocator,
                createStaticSpriteState(
                    metadata.sprite,
                    { x: x + 0.5, y: y + 0.5 },
                    metadata.height,
                    metadata.size,
                    metadata.size
                )
            );
        case "00ff00":
            if (metadata.configuration) {
                return EntityFactory.DOOR_LOCKED(
                    serviceLocator,
                    createLockedDoorState({
                        x,
                        y,
                        spriteString: Sprites.CELL,
                        configuration: metadata.configuration,
                        horizontal: metadata.horizontal,
                        keyId: metadata.keyId,
                    })
                );
            } else {
                return EntityFactory.DOOR(
                    serviceLocator,
                    createDoorState(x, y, Sprites.CELL, metadata.horizontal)
                );
            }
        case "ffff00":
            return EntityFactory.ITEM_DROP(
                serviceLocator,
                createItemDropState({
                    item: GameItems[metadata.id as GameItem],
                    position: { x: x + 0.5, y: y + 0.5 },
                })
            );
        case "ff00f2":
            return EntityFactory.LADDER(
                serviceLocator,
                createLadderState(x, y, Sprites.LADDER, metadata.destination)
            );
        case "000000":
            return [
                EntityFactory.SCENERY_FLOOR(
                    serviceLocator,
                    createStaticFloorState(
                        Sprites.FLOOR,
                        0,
                        { x, y },
                        { x: x + 1, y: y + 1 }
                    )
                ),
                EntityFactory.SCENERY_FLOOR(
                    serviceLocator,
                    createStaticFloorState(
                        Sprites.FLOOR,
                        1,
                        { x, y },
                        { x: x + 1, y: y + 1 }
                    )
                ),
            ];
        case "ffffff":
            return [
                EntityFactory.SCENERY_FLOOR(
                    serviceLocator,
                    createStaticFloorState(
                        Sprites.FLOOR_HOLE,
                        0,
                        { x, y },
                        { x: x + 1, y: y + 1 }
                    )
                ),
                EntityFactory.SCENERY_FLOOR(
                    serviceLocator,
                    createStaticFloorState(
                        Sprites.FLOOR_HOLE,
                        1,
                        { x, y },
                        { x: x + 1, y: y + 1 }
                    )
                ),
            ];
    }

    return [];
};
