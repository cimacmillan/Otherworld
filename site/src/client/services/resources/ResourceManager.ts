import { loadSound } from "../audio/AudioService";
import { defaultManifest } from "./manifests/DefaultManifest";
import {
    loadImage,
    loadSpriteSheet,
    loadTextureFromURL,
} from "./TextureLoader";
import { LoadedManifest, ResourceManifest } from "./Types";

export class ResourceManager {
    public manifest: LoadedManifest;

    // Legacy
    public wall: WebGLTexture;
    public floor: WebGLTexture;
    public uiImage: HTMLImageElement;

    public async load(gl: WebGLRenderingContext, audio: AudioContext) {
        this.manifest = await this.loadManifest(gl, audio, defaultManifest);

        this.wall = await loadTextureFromURL(gl, "img/wall.png");
        this.floor = await loadTextureFromURL(gl, "img/floor.png");
        this.uiImage = await loadImage("img/floor.png");
    }

    public async loadManifest(
        gl: WebGLRenderingContext,
        audio: AudioContext,
        manifest: ResourceManifest
    ) {
        const loadedManifest: LoadedManifest = {
            spritesheets: {},
            audio: {},
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
