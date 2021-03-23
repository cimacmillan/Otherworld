import { mat4, vec3 } from "gl-matrix";
import { forEach3D } from "../../../util/math";
import { ServiceLocator } from "../../ServiceLocator";
import { Voxel3D } from "./Voxel3D";

interface VoxelGroupData {
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
                            colour: colourMap[voxelId ? voxelId - 1 : 0],
                            transform: this.transform
                        });
                        if (voxelId > 0) {
                            voxel.attach();
                        }
                        return voxel;
                    }
                )
            )
        )
    }

    public onDataUpdate() {
        const { colourMap, data } = this.voxelGroupData;
        forEach3D(this.voxels, (voxel: Voxel3D, x: number, y: number, z: number) => {
            const voxelId = data[x][y][z];
            if (voxelId > 0) {
                voxel.setColour(colourMap[voxelId - 1]);
                voxel.attach();
            } else {
                voxel.destroy();
            }
        })
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

