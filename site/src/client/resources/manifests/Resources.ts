import { MapPrison } from "../maps/maps/Prison";
import { ResourceManifestBuilder } from "../ResourceManifestBuilder";
import { sprites, SpriteSheets } from "./Sprites";

export enum Maps {
    PRISON = "PRISON",
}

// const ui = new SpriteSheetManifestBuilder("img/ui.png");

const manifest: ResourceManifestBuilder = new ResourceManifestBuilder();
manifest.Spritesheet(SpriteSheets.SPRITE, sprites);
manifest.Map(Maps.PRISON, MapPrison);

export const defaultManifest = manifest;
