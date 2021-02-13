interface TiledInterface {
    map: {
        $: {
            height: string;
            infinite: string;
            nextlayerid: string;
            nextobjectid: string;
            orientation: string;
            renderorder: "right-down";
            tiledversion: "1.4.3";
            tileheight: "20";
            tilewidth: "20";
            version: "1.4";
            width: "100";
        };
    };
}

export interface GameTiledMap {}

export function tiledXMLtoGameTiledMap(tmx: TiledInterface): GameTiledMap {
    return {};
}
