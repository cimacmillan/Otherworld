import { ServiceLocator } from "../../ServiceLocator";
import { mat4, vec3 } from "gl-matrix";
import { RenderItem } from "../types/RenderInterface";
import { Object3D } from "../services/ObjectRenderService";

interface VoxelData {
    position: vec3;
    size: number;
    colour: vec3;
    transform?: mat4;
}

const IDENTITY = mat4.identity(mat4.create());

export class Voxel3D {
    private item?: RenderItem;
    private itemData?: Object3D;

    public constructor (private serviceLocator: ServiceLocator, private data: VoxelData) {
    }

    public setColour(colour: vec3) {
        this.data.colour = colour;
        if (this.item && this.itemData) {
            this.serviceLocator.getRenderService().triangleRenderService.updateItem(this.item, {
                colour: this.itemData.colour.map(() => colour)
            })
        }
    }
    
    public attach() {
        if (this.item) {
            return;
        }
        const { triangleRenderService } = this.serviceLocator.getRenderService();
        const { position, size, colour } = this.data;
        const transform = this.data.transform || IDENTITY;

        this.itemData = {
            positions: [],
            colour: [],
            transform
        }

        const createTriangle = (positions: [vec3, vec3, vec3], colour: vec3) => {
            this.itemData.positions.push(positions);
            this.itemData.colour.push(colour);
        }

        const createQuad = (positions: [vec3, vec3, vec3, vec3], col: vec3) => {
            createTriangle([positions[0], positions[1], positions[2]], col);
            createTriangle([positions[0], positions[3], positions[2]], col);
        }

        const [x, y, z] = position;


        const colourVariance = 0.4;
        const darker = vec3.scale(vec3.create(), colour, 1 - (colourVariance / 2));
        const darkest = vec3.scale(vec3.create(), colour, 1 - (colourVariance));

        //Back
        createQuad([
            [x, y, z],
            [x + size, y, z],
            [x + size, y + size, z],
            [x, y + size, z]
        ], colour
        );

        //Front
        createQuad([
            [x, y, z + size],
            [x + size, y, z + size],
            [x + size, y + size, z + size],
            [x, y + size, z + size]
        ], colour);

        //Left
        createQuad([
            [x, y, z],
            [x, y, z + size],
            [x, y + size, z + size],
            [x, y + size, z]
        ], darkest);

        //Right
        createQuad([
            [x + size, y, z],
            [x + size, y, z + size],
            [x + size, y + size, z + size],
            [x + size, y + size, z]
        ], darkest);

        //Bottom
        createQuad([
            [x, y, z],
            [x + size, y, z],
            [x + size, y, z + size],
            [x, y, z + size]
        ], darker);

        //Top
        createQuad([
            [x, y + size, z],
            [x + size, y + size, z],
            [x + size, y + size, z + size],
            [x, y + size, z + size]
        ], darker);

        this.item = triangleRenderService.createItem(this.itemData);
    }

    public destroy() {
        const { triangleRenderService } = this.serviceLocator.getRenderService();
        if (this.item) {
            triangleRenderService.freeItem(this.item);
        }
        this.item = undefined;
    }

    public isBeingDrawn() {
        return !!this.item;
    }
}
