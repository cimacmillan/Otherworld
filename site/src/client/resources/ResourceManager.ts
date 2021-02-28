import { Actions } from "../Actions";
import { loadSound } from "../services/audio/AudioService";
import { tiledXMLtoGameTiledMap } from "../services/map/TiledParser";
import { State } from "../ui/State";
import { Store } from "../util/engine/Store";
// import { setLoadPercentage } from "../ui/actions/GameStartActions";
import { defaultManifest } from "./manifests/Resources";
import { loadSpriteSheet } from "./TextureLoader";
import { LoadedManifest, ResourceManifest } from "./Types";

export class ResourceManager {
    public manifest: LoadedManifest;

    public async load(
        gl: WebGLRenderingContext,
        audio: AudioContext,
        store: Store<State, Actions>
    ) {
        this.manifest = await this.loadManifest(
            gl,
            audio,
            defaultManifest,
            (percentage: number) => store.getActions().setGameLoadPercentage(percentage)
        );
    }

    public async loadManifest(
        gl: WebGLRenderingContext,
        audio: AudioContext,
        manifest: ResourceManifest,
        setPercentage: (percentage: number) => void
    ) {
        setPercentage(0);
        const total =
            Object.keys(manifest.audio).length +
            Object.keys(manifest.spritesheets).reduce(
                (prevValue: number, next: string) => {
                    return (
                        prevValue +
                        Object.keys(manifest.spritesheets[next].animations)
                            .length +
                        Object.keys(manifest.spritesheets[next].sprites).length
                    );
                },
                0
            ) +
            Object.keys(manifest.maps).length;
        let current = 0;
        const increment = () => {
            current++;
            setPercentage(current / total);
        };

        const loadedManifest: LoadedManifest = {
            spritesheets: {},
            audio: {},
            maps: {},
        };

        for (const key in manifest.audio) {
            loadedManifest.audio[key] = await loadSound(
                manifest.audio[key].url,
                audio,
                manifest.audio[key].metadata
            );
            increment();
        }

        for (const key in manifest.spritesheets) {
            const spritesheetManifest = manifest.spritesheets[key];
            loadedManifest.spritesheets[key] = await loadSpriteSheet(
                gl,
                spritesheetManifest.url
            );

            for (const spriteKey in spritesheetManifest.sprites) {
                const sprite = spritesheetManifest.sprites[spriteKey];
                loadedManifest.spritesheets[key].registerSprite(
                    spriteKey,
                    sprite.width,
                    sprite.height,
                    sprite.x,
                    sprite.y
                );
                increment();
            }

            for (const animationKey in spritesheetManifest.animations) {
                const animation = spritesheetManifest.animations[animationKey];
                loadedManifest.spritesheets[key].registerAnimation(
                    animationKey,
                    animation.width,
                    animation.height,
                    animation.x,
                    animation.y,
                    animation.frames,
                    animation.vertical
                );
                increment();
            }
        }

        for (const key in manifest.maps) {
            const mapSchema = manifest.maps[key];
            const mapData = await (await fetch(mapSchema.url)).text();
            const parse = new (require("xml2js").Parser)();
            const tmxJson = tiledXMLtoGameTiledMap(
                await parse.parseStringPromise(mapData)
            );
            loadedManifest.maps[key] = {
                tiled: tmxJson,
                metadata: mapSchema.metadata,
            };

            increment();
        }

        return loadedManifest;
    }
}
