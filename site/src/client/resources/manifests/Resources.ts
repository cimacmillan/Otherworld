import { MapCellar } from "../maps/MapCellar";
import { MapPrison } from "../maps/MapPrison";
import { MapTest } from "../maps/MapTest";
import { ResourceManifestBuilder } from "../ResourceManifestBuilder";
import { audios } from "./Audios";
import { Maps } from "./Maps";

export enum SpriteSheets {
    SPRITE = "SPRITE",
}

const manifest: ResourceManifestBuilder = new ResourceManifestBuilder();
manifest.Spritesheet(SpriteSheets.SPRITE, "img/out");
manifest.Map(Maps.PRISON, MapPrison);
manifest.Map(Maps.CELLAR, MapCellar);
manifest.Map(Maps.TEST, MapTest);
manifest.Builder(audios);

export const defaultManifest = manifest;
