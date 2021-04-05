import { MapCellar } from "../maps/MapCellar";
import { MapPrison } from "../maps/MapPrison";
import { MapTest } from "../maps/MapTest";
import { ResourceManifestBuilder } from "../ResourceManifestBuilder";
import { audios } from "./Audios";
import { Maps } from "./Maps";
import { sprites, SpriteSheets } from "./Sprites";

// const ui = new SpriteSheetManifestBuilder("img/ui.png");

const manifest: ResourceManifestBuilder = new ResourceManifestBuilder();
manifest.Spritesheet(SpriteSheets.SPRITE, sprites);
manifest.Map(Maps.PRISON, MapPrison);
manifest.Map(Maps.CELLAR, MapCellar);
manifest.Map(Maps.TEST, MapTest);
manifest.Builder(audios);

export const defaultManifest = manifest;
