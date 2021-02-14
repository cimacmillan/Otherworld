import { Vector2D } from "../../types";

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
            object: Array<{
                $: {
                    id: string;
                    type: string;
                    x: string;
                    y: string;
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
            }>;
        }>;
    };
}

export interface GameTiledMap {
    width: number;
    height: number;
    objects: GameTiledObject[];
}

interface PolyObject {
    data: GameTiledObjectMetadata;
    type: "Polygon";
    points: Vector2D[];
    closed: boolean;
}

type GameTiledObject = PolyObject;

interface GameTiledObjectMetadata {
    id: number;
    type?: string;
    x: number;
    y: number;
}

export function tiledXMLtoGameTiledMap(tmx: TiledInterface): GameTiledMap {
    console.log(tmx);

    const { map } = tmx;
    const { $, objectgroup } = map;
    const { width, height, tilewidth, tileheight } = $;
    const tWidth = Number.parseInt(tilewidth);
    const tHeight = Number.parseInt(tileheight);

    const objects: GameTiledObject[] = [];
    objectgroup.forEach((group) =>
        group.object.forEach((object) => {
            const data = {
                id: Number.parseInt(object.$.id),
                type: object.$.type,
                x: Number.parseInt(object.$.x),
                y: Number.parseInt(object.$.y),
            };
            let objGeo: GameTiledObject;
            const poly = object.polyline || object.polygon;
            if (poly) {
                objGeo = {
                    data,
                    type: "Polygon",
                    points: poly[0].$.points.split(" ").map((str) => {
                        const nums = str.split(",");
                        const x = (Number.parseInt(nums[0]) + data.x) / tWidth;
                        const y = (Number.parseInt(nums[1]) + data.y) / tHeight;
                        return { x, y };
                    }),
                    closed: !!object.polygon,
                };
            }
            objGeo && objects.push(objGeo);
        })
    );

    return {
        width: Number.parseInt(width),
        height: Number.parseInt(height),
        objects,
    };
}
