import {
    createStaticFloor,
    createStaticWall,
} from "../engine/scripting/factory/SceneryFactory";
import { ServiceLocator } from "../services/ServiceLocator";
import { Sprites } from "./manifests/DefaultManifest";
import { FloorSchema, MapSchema, WallSchema } from "./MapShema";

export function loadMap(serviceLocator: ServiceLocator, mapSchema: MapSchema) {
    mapSchema.walls.forEach((wall) => loadWall(serviceLocator, wall));
    mapSchema.floors.forEach((floor) => loadFloor(serviceLocator, floor));
}

export function loadWall(serviceLocator: ServiceLocator, wall: WallSchema) {
    serviceLocator.getWorld().addEntity(
        createStaticWall(
            serviceLocator,
            wall.texture === undefined ? Sprites.FLOOR : wall.texture,
            {
                x: wall.startx,
                y: wall.starty,
            },
            {
                x: wall.endx,
                y: wall.endy,
            },
            wall.height,
            wall.offset,
            wall.collides
        )
    );
}

export function loadFloor(serviceLocator: ServiceLocator, floor: FloorSchema) {
    serviceLocator.getWorld().addEntity(
        createStaticFloor(
            serviceLocator,
            floor.texture === undefined ? Sprites.FLOOR : floor.texture,
            floor.height ? floor.height : 0,
            {
                x: floor.startx,
                y: floor.starty,
            },
            {
                x: floor.endx,
                y: floor.endy,
            }
        )
    );
}
