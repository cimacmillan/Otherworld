
import { mat4, vec2, vec3 } from "gl-matrix";
import { ResourceManager } from "../../../resources/ResourceManager";
import { ConsistentArray } from "../../../util/array/ConsistentArray";
import { ISyncedArrayRef, SyncedArray } from "../../../util/array/SyncedArray";
import { ServiceLocator } from "../../ServiceLocator";
import { compileSpriteShader } from "../shaders/Shaders";
import { CompiledShader } from "../shaders/types";
import { Sprite } from "../types/RenderInterface";
import { RenderItem, RenderItemInterface } from "../types/RenderItemInterface";
import {
    BackgroundRenderService,
    BackgroundShaderPositions,
} from "./BackgroundRenderService";
import { SpriteRenderService } from "./SpriteRenderService";

export interface TextRender {
    contents: string;
    colour: {
        r: number;
        g: number;
        b: number;
    },
    position: vec2,
    height: number,
    size: number,
    angle: number
}

const CHAR_MAG_SPACING = 0.8;

interface TextRenderObject {
    textRender: TextRender;
    sprites: RenderItem[]
}

export class TextRenderService implements RenderItemInterface<TextRender> {
    private gl: WebGLRenderingContext;
    private textArray: SyncedArray<TextRenderObject>;

    public constructor(
        private resourceManager: ResourceManager,
        private spriteRenderService: SpriteRenderService
    ) {}

    public init(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.textArray = new SyncedArray({
            onUpdate: (array: Array<ISyncedArrayRef<TextRenderObject>>) => undefined,
            onReconstruct: (array: Array<ISyncedArrayRef<TextRenderObject>>) => undefined,
            onInjection: (index: number, obj: ISyncedArrayRef<TextRenderObject>) => undefined
        })
    }

    public draw() {
        this.textArray.sync();
    }

    public createItem(param: TextRender) {
        const textRenderObject = this.constructTextRenderObject(param);
        return {
            renderId: this.textArray.createItem(textRenderObject)
        };
    }

    public updateItem(ref: RenderItem, param: Partial<TextRender>) {
        const index = this.textArray.findRealIndexOf(ref.renderId);
        const textRenderObject = this.textArray.getArray()[index].obj;
        const { textRender, sprites } = textRenderObject;
        const newTextRender = { ...textRender, ...param} ;
        const { contents } = newTextRender;
        let newSprites = sprites;

        if (contents.length !== sprites.length) {
            for (let i = sprites.length; i < contents.length; i++) {
                newSprites.push(this.spriteRenderService.createItem(this.constructTextChar(newTextRender, index)))
            }
            for (let i = sprites.length; i > contents.length; i--) {
                this.spriteRenderService.freeItem(sprites[i - 1]);
            }
            newSprites = newSprites.slice(0, contents.length);
        }

        contents.split("")
            .map((_, index: number) => this.constructTextChar(newTextRender, index))
            .forEach((newSprite, index: number) => this.spriteRenderService.updateItem(sprites[index], newSprite));

        this.textArray.updateItem(ref.renderId, { sprites: newSprites, textRender: newTextRender});
    }

    public freeItem(ref: RenderItem) {
        const index = this.textArray.findRealIndexOf(ref.renderId);
        const textRenderObject = this.textArray.getArray()[index].obj;
        textRenderObject.sprites.forEach((sprite) => {
            this.spriteRenderService.freeItem(sprite)
        })
        this.textArray.freeItem(ref.renderId);
    }

    private constructTextRenderObject(textRender: TextRender): TextRenderObject {
        const { contents} = textRender;
        const sprites = contents.split("")
            .map((_, index: number) => this.constructTextChar(textRender, index))
            .map(sprite => this.spriteRenderService.createItem(sprite));
        return { 
            textRender,
            sprites: sprites
        }
    }   

    private constructTextChar(textRender: TextRender, charCount: number): Sprite {
        const { position, size, colour, height, contents, angle } = textRender;
        const mag = size * charCount * CHAR_MAG_SPACING;
        const rotatedPosition: vec2 = [
            position[0] + Math.cos(angle) * mag,
            position[1] + Math.sin(angle) * mag
        ];
        return {
            position: rotatedPosition,
            size: [size, size],
            height,
            shade: {...colour, intensity: 1 },
            texture: this.getFont(this.getFrameFromChar(contents.charAt(charCount)))
        };
    }

    private getFont(frame: number) {
        const sheet = this.resourceManager.getDefaultSpriteSheet();
        const image = sheet.getAnimationFrame("font", frame).textureCoordinate;
        return image;
    }

    private getFrameFromChar(char: string): number {
        const alphabetCharCode = 65;
        const numberCharCode = 48;
        const upperCase = char.toUpperCase();
        const code = upperCase.charCodeAt(0);

        if (code - numberCharCode < 10 && code - numberCharCode >= 0) {
            return code - numberCharCode;
        }

        if (code - alphabetCharCode < 26 && code - alphabetCharCode >= 0) {
            return code - alphabetCharCode;
        }

        return 0;
    }
}


