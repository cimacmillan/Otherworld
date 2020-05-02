import { loadSound } from "../services/audio/AudioService";
import { defaultManifest } from "./manifests/DefaultManifest";
import { loadSpriteSheet } from "./TextureLoader";
import { LoadedManifest, ResourceManifest } from "./Types";

export class ResourceManager {
    public manifest: LoadedManifest;

    public async load(gl: WebGLRenderingContext, audio: AudioContext) {
        this.manifest = await this.loadManifest(gl, audio, defaultManifest);
    }

    public async loadManifest(
        gl: WebGLRenderingContext,
        audio: AudioContext,
        manifest: ResourceManifest
    ) {
        const loadedManifest: LoadedManifest = {
            spritesheets: {},
            audio: {},
            maps: manifest.maps,
        };

        for (const key in manifest.audio) {
            loadedManifest.audio[key] = await loadSound(
                manifest.audio[key],
                audio
            );
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
            }
        }

        return loadedManifest;
    }
}
