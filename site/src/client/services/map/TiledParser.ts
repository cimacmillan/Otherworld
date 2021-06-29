import { Vector2D } from "../../types";
import {
    defaultTiledObjectProperties,
    TiledObjectType,
} from "./TiledProperties";

interface TiledInterface {
    map: {
        $: {
            height: string;
            infinite: string;
            nextlayerid: string;
            nextobjectid: string;
            orientation: string;
            renderorder: string;
            tiledversion: string;
            tileheight: string;
            tilewidth: string;
            version: string;
            width: string;
        };
        objectgroup: Array<{
            $: {
                id: string;
                name: string;
            };
            object: TMXObject[];
        }>;
    };
}

interface TMXObject {
    $: {
        id: string;
        x: string;
        y: string;
        type?: string;
        width?: string;
        height?: string;
    };
    polyline?: Array<{
        $: {
            points: string;
        };
    }>;
    polygon?: Array<{
        $: {
            points: string;
        };
    }>;
    point?: string[];
    ellipse?: string[];
    properties?: Array<{
        property: Array<{
            $: {
                name: string;
                value: string;
            };
        }>;
    }>;
}

export interface GameTiledMap {
    width: number;
    height: number;
    objects: GameTiledObject[];
}

export enum GameTiledObjectType {
    Ellipse = "Ellipse",
    Polygon = "Polygon",
    Rectangle = "Rectangle",
    Point = "Point",
}
interface CommonTiledObject {
    data: {
        id: number;
        type: string;
        x: number;
        y: number;
        properties: Record<string, string>;
    };
}

export interface PolyObject extends CommonTiledObject {
    type: GameTiledObjectType.Polygon;
    points: Vector2D[];
    closed: boolean;
}

export interface RectangleObject extends CommonTiledObject {
    type: GameTiledObjectType.Rectangle;
    width: number;
    height: number;
}

export interface EllipseObject extends CommonTiledObject {
    type: GameTiledObjectType.Ellipse;
    width: number;
    height: number;
}

export interface PointObject extends CommonTiledObject {
    type: GameTiledObjectType.Point;
}

export type GameTiledObject =
    | PolyObject
    | RectangleObject
    | EllipseObject
    | PointObject;

export function tiledXMLtoGameTiledMap(tmx: TiledInterface): GameTiledMap {
    const { map } = tmx;
    const { $, objectgroup } = map;
    const { width, height, tilewidth, tileheight } = $;
    const tWidth = Number.parseFloat(tilewidth);
    const tHeight = Number.parseFloat(tileheight);

    const destination: GameTiledObject[] = [];
    objectgroup.forEach((group) =>
        group.object.forEach((object) => {
            parseObject({
                object,
                destination,
                tileWidth: tWidth,
                tileHeight: tHeight,
            });
        })
    );

    return {
        width: Number.parseFloat(width),
        height: Number.parseFloat(height),
        objects: destination,
    };
}

function parseObject(args: {
    object: TMXObject;
    destination: GameTiledObject[];
    tileWidth: number;
    tileHeight: number;
}) {
    const { object, destination, tileWidth, tileHeight } = args;

    const objectType = object.$.type;

    const properties: Record<string, string> =
        objectType &&
        defaultTiledObjectProperties[objectType as TiledObjectType]
            ? { ...defaultTiledObjectProperties[objectType as TiledObjectType] }
            : {};
    if (object.properties) {
        object.properties.forEach((property) => {
            property.property.forEach((prop) => {
                properties[prop.$.name] = prop.$.value;
            });
        });
    }

    const data = {
        id: Number.parseFloat(object.$.id),
        type: objectType,
        x: Number.parseFloat(object.$.x) / tileWidth,
        y: Number.parseFloat(object.$.y) / tileHeight,
        properties,
    };

    const poly = object.polyline || object.polygon;

    if (poly) {
        destination.push({
            data,
            type: GameTiledObjectType.Polygon,
            points: poly[0].$.points.split(" ").map((str) => {
                const nums = str.split(",");
                const x = Number.parseFloat(nums[0]) / tileWidth + data.x;
                const y = Number.parseFloat(nums[1]) / tileHeight + data.y;
                return { x, y };
            }),
            closed: !!object.polygon,
        });
    }

    if (object.$.width && object.$.height) {
        if (object.ellipse) {
            destination.push({
                data,
                type: GameTiledObjectType.Ellipse,
                width: Number.parseFloat(object.$.width) / tileWidth,
                height: Number.parseFloat(object.$.height) / tileHeight,
            });
        } else {
            destination.push({
                data,
                type: GameTiledObjectType.Rectangle,
                width: Number.parseFloat(object.$.width) / tileWidth,
                height: Number.parseFloat(object.$.height) / tileHeight,
            });
        }
    } else {
        if (!poly) {
            destination.push({
                data,
                type: GameTiledObjectType.Point,
            });
        }
    }
}
