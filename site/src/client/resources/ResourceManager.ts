import { loadSound } from "../services/audio/AudioService";
import { Actions } from "../ui/actions/Actions";
import { setLoadPercentage } from "../ui/actions/GameStartActions";
import { defaultManifest } from "./manifests/DefaultManifest";
import { loadSpriteSheet, loadImage, loadImageData } from "./TextureLoader";
import { LoadedManifest, ResourceManifest } from "./Types";

export class ResourceManager {
    public manifest: LoadedManifest;

    public async load(
        gl: WebGLRenderingContext,
        audio: AudioContext,
        uiListener: (actions: Actions) => void
    ) {
        this.manifest = await this.loadManifest(
            gl,
            audio,
            defaultManifest,
            (percentage: number) => uiListener(setLoadPercentage(percentage))
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
            ) + Object.keys(manifest.maps).length;
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
                manifest.audio[key],
                audio
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
            loadedManifest.maps[key] = {
                layers: []
            };

            for (const layer of mapSchema.layers) {
                const layerUrl = layer.imageUrl;
                const image = await loadImageData(layerUrl);
             
                loadedManifest.maps[key].layers.push({
                    image
                });
            }

            increment();
        }

        return loadedManifest;
    }
}
