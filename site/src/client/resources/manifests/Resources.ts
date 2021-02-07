import { MapCellar } from "../maps/maps/MapCellar";
import { MapPrison } from "../maps/maps/MapPrison";
import { ResourceManifestBuilder } from "../ResourceManifestBuilder";
import { audios } from "./Audios";
import { Maps } from "./Maps";
import { sprites, SpriteSheets } from "./Sprites";

// const ui = new SpriteSheetManifestBuilder("img/ui.png");

const manifest: ResourceManifestBuilder = new ResourceManifestBuilder();
manifest.Spritesheet(SpriteSheets.SPRITE, sprites);
manifest.Map(Maps.PRISON, MapPrison);
manifest.Map(Maps.CELLAR, MapCellar);
manifest.Builder(audios);

export const defaultManifest = manifest;
