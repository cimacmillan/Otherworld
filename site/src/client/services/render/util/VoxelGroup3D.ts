import { mat4, vec3 } from "gl-matrix";
import { forEach3D } from "../../../util/math";
import { ServiceLocator } from "../../ServiceLocator";
import { Object3D } from "../services/ObjectRenderService";
import { RenderItem } from "../types/RenderInterface";
import { Voxel3D } from "./Voxel3D";

export interface VoxelGroupData {
    data: number[][][],
    colourMap: vec3[],
    sizePerVoxel: number;
}

export class VoxelGroup3D {
    private voxels: Voxel3D[][][];
    private transform: mat4 = mat4.identity(mat4.create());
    private position: vec3 = [0, 0, 0];
    private angle: vec3 = [0, 0, 0];
    private center: vec3 = [0, 0, 0];
    private scale: vec3 = [1, 1, 1];
    private renderItem?: [RenderItem, Object3D];

    public constructor(private serviceLocator: ServiceLocator, private voxelGroupData: VoxelGroupData) {
        const { data, colourMap, sizePerVoxel } = voxelGroupData;

        this.voxels = data.map(
            (ys, x) => ys.map(
                (zs, y) => zs.map(
                    (voxelId, z) => {
                        const voxel = new Voxel3D(serviceLocator, {
                            position: [
                                x * sizePerVoxel,
                                y * sizePerVoxel,
                                z * sizePerVoxel
                            ],
                            size: sizePerVoxel,
                            colour: colourMap[voxelId ? voxelId - 1 : 0]
                        });
                        return voxel;
                    }
                )
            )
        )
    }

    public attach() {
        this.onDataUpdate();
    }

    public destroy() {
        forEach3D(this.voxels, (voxel: Voxel3D) => {
            voxel.destroy();
        });
        if (this.renderItem) {
            this.serviceLocator.getRenderService().triangleRenderService.freeItem(this.renderItem[0]);
            this.renderItem = undefined;
        }
    }

    public onDataUpdate() {
        const { colourMap, data } = this.voxelGroupData;

        const object3D: Object3D = {
            positions: [],
            colour: [],
            transform: this.transform
        }

        forEach3D(this.voxels, (voxel: Voxel3D, x: number, y: number, z: number) => {
            const voxelId = data[x][y][z];
            if (voxelId > 0) {
                voxel.setColour(colourMap[voxelId - 1]);
                voxel.attach();
            } else {
                voxel.destroy();
            }

            const itemData = voxel.getData();
            itemData && object3D.positions.push(...itemData.positions);
            itemData && object3D.colour.push(...itemData.colour);
        });

        if (this.renderItem) {

            const [item, object] = this.renderItem;
            
            if (object3D.positions.length === object.positions.length) {
                this.serviceLocator.getRenderService().triangleRenderService.updateItem(item, object3D);
            } else {
                this.serviceLocator.getRenderService().triangleRenderService.freeItem(item);
                const newItem = this.serviceLocator.getRenderService().triangleRenderService.createItem(object3D);
                this.renderItem = [newItem, object3D];
            }

        } else {
            const item = this.serviceLocator.getRenderService().triangleRenderService.createItem(object3D);
            this.renderItem = [item, object3D];
        }
    } 

    public setPosition(position: vec3) {
        this.position = position;
        this.recomputeTransform();
    }

    public setAngle(angle: vec3) {
        this.angle = angle;
        this.recomputeTransform();
    }

    public setCenter(center: vec3) {
        this.center = center;
        this.recomputeTransform();
    }

    public setScale(scale: vec3) {
        this.scale = scale;
        this.recomputeTransform();
    }

    private recomputeTransform() {
        mat4.identity(this.transform);    
        mat4.translate(this.transform, this.transform, this.position);
        mat4.translate(this.transform, this.transform, [this.center[0], this.center[1], this.center[2]]);
        mat4.rotateX(this.transform, this.transform, this.angle[0]);
        mat4.rotateY(this.transform, this.transform, this.angle[1]);
        mat4.rotateZ(this.transform, this.transform, this.angle[2]);
        mat4.translate(this.transform, this.transform, [-this.center[0], -this.center[1], -this.center[2]]);
    }

}

