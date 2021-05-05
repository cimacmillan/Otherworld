
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
    size: number
}

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

    }

    public freeItem(ref: RenderItem) {

    }

    private constructTextRenderObject(textRender: TextRender): TextRenderObject {
        const { position, size, colour, height} = textRender;
        const item = this.spriteRenderService.createItem({
            position,
            size: [size, size],
            height,
            shade: {...colour, intensity: 1 },
            texture: this.getFont(0)
        });
        return { 
            textRender,
            sprites: [item]
        }
    }   

    private getFont(frame: number) {
        const sheet = this.resourceManager.getDefaultSpriteSheet();
        const image = sheet.getAnimationFrame("font", frame).textureCoordinate;
        return image;
    }
}


